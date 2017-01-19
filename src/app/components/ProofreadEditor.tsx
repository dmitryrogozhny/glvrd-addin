import * as React from "react";
import {Editor, EditorState, ContentState, SelectionState,
        Entity, ContentBlock, CompositeDecorator,
        Modifier, CharacterMetadata} from "draft-js";
import * as PubSubJs from "pubsub-js";

import {IProofreadResult, IProofreadComment} from "../stores/ProofreadStore";
import CommentTokenSpan from "./CommentTokenSpan";

interface IProofreadEditorProps {
    content: string;
    proofreadResult: IProofreadResult;
    onContentChange: (content: string) => void;
    placeholder: string;
    readOnly: boolean;
}

interface IProofreadEditorState {
    editorState: EditorState;
}

export default class ProofreadEditor extends React.Component<IProofreadEditorProps, IProofreadEditorState> {
    // Decorator highlights entities in the editor
    private decorator: CompositeDecorator = new CompositeDecorator([ { strategy: this.getEntityStrategy, component: CommentTokenSpan }]);
    // Keeps the id of the timer used for firing delayed events
    private requestProofreadTimer: number = -1;
    // Amount of milliseconds to wait before requesting the proofreading
    private proofreadTimeout: number = 1000;

    private commentSubscriber: string;

    constructor(props: IProofreadEditorProps) {
        super();
        this.state = {editorState: EditorState.createWithContent(ContentState.createFromText(props.content), this.decorator)};        
    }

    onChange: (editorState: EditorState) => void = (editorState: EditorState) => {
        if (editorState.getCurrentContent() !== this.state.editorState.getCurrentContent()) {
            // Set timer to perform proofreading.
            // If timer is already running, cancel it first
            if (this.requestProofreadTimer !== -1) {
                clearTimeout(this.requestProofreadTimer);
                this.requestProofreadTimer = -1;
            }

            this.requestProofreadTimer = setTimeout(
                                                () => {
                                                    this.props.onContentChange(this.state.editorState.getCurrentContent().getPlainText());
                                                },
                                                this.proofreadTimeout);
        }

        // Check whether the current selection has changed and the cursor is over the entity.
        // If cursor is over the entity, trigger the activeCommentChange event.
        if (editorState.getSelection() !== this.state.editorState.getSelection()) {
            const selection: SelectionState = editorState.getSelection();
            const contentBlock: ContentBlock = editorState.getCurrentContent().getBlockForKey(selection.getFocusKey());
            const entityKey: string = contentBlock.getEntityAt(selection.getFocusOffset());

            if (entityKey) {
                // Use setTimeout to call onActiveCommentChange after the function ends to avoid race conditions 
                // I.e. set new editorState as soon as possible, and apply additional processing later.
                setTimeout(() => this.onActiveCommentChange("", entityKey), 0);
            }
        }

        this.setState({editorState: editorState} );
    }

    onActiveCommentChange: (eventId: string, activeCommentKey: string) => void = (eventId: string, activeCommentKey: string) => {
        // Propogate the event
        let activeComment: IProofreadComment = null;

        // TODO: check how Entity gets its context for get()
        if (activeCommentKey != null) {
            const entityData: {comment: IProofreadComment} = Entity.get(activeCommentKey).getData();
            activeComment = entityData.comment;
        }

        PubSubJs.publish("ACTIVE_COMMENT_CHANGED", activeComment);
    }

    componentDidMount(): void {        
        this.commentSubscriber = PubSubJs.subscribe("SELECTED_ENTITY_CHANGED", this.onActiveCommentChange);

        this.setState({editorState: EditorState.moveFocusToEnd(this.state.editorState)});
        this.init(this.props.proofreadResult);        
    }

    componentWillUnmount(): void {
        PubSubJs.unsubscribe(this.commentSubscriber);
    }

    componentWillReceiveProps(nextProps: IProofreadEditorProps): void {
        // Set new content
        const newEditorState: EditorState = EditorState.createWithContent(ContentState.createFromText(nextProps.content),
                                                                          this.decorator);        
        this.setState({editorState: newEditorState});
        this.init(nextProps.proofreadResult);
    }

    init(proofreadResult: IProofreadResult): void {
        if ((proofreadResult == null) || (proofreadResult.fragments == null) || (proofreadResult.fragments.length === 0)) {
            return;
        }

        const contentState: ContentState = this.state.editorState.getCurrentContent();
        const blocks: ContentBlock[] = contentState.getBlocksAsArray();
        
        let newEditorState: EditorState = this.state.editorState;        

        let currentCommentIndex: number = 0;
        let blockTextOffset: number = 0;

        // Iterate through blocks of content
        for (let block of blocks) {
            const blockKey: string = block.getKey();
            const blockText: string = block.getText();

            // Iterate through the collection of comments.
            // For each content block continue from the last processed comment (index stored in currentCommentIndex).
            for (let i: number = currentCommentIndex; i < proofreadResult.fragments.length; i++) {
                const comment: IProofreadComment = proofreadResult.fragments[i];
                const phrase: string = comment.phrase;
                const indexOfPhrase: number = comment.start - blockTextOffset;

                if (indexOfPhrase < blockText.length) {
                    const selection: SelectionState = SelectionState.createEmpty(blockKey)
                        .set("anchorOffset", indexOfPhrase)
                        .set("focusOffset", indexOfPhrase + phrase.length)  as SelectionState;

                    const entityKey: string = Entity.create("PROOFREAD_COMMENT", "IMMUTABLE", {comment: comment});
                    const newContent: ContentState = Modifier.replaceText(newEditorState.getCurrentContent(), selection,
                                                                          phrase, null, entityKey.toString());

                    newEditorState = EditorState.push(newEditorState, newContent, "apply-entity");

                    // Current comment processed, proceed to the next one.
                    currentCommentIndex++;
                } else {
                    // No more comments in the current content block. Continue to the next one.
                    break;
                }
            }

            // The offset keeps the length of previous blocks to calculate the position of a comment inside a current block.
            // Take length of a block plus one for new line.
            blockTextOffset += blockText.length + 1;
        }

        // We need to set the selection state to the current selection state before updating the editor state.
        // Otherwise, the visual selection would stay the same but the logical will move to the last highlighted comment.
        // E.g. if a user will hit backspace, the last comment would get deleted instead of the current selection.  
        newEditorState = EditorState.forceSelection(newEditorState, this.state.editorState.getSelection());

        this.setState({editorState: newEditorState});
    }

    getEntityStrategy(contentBlock: ContentBlock, callback: (start:number, end: number) => void): void {
        contentBlock.findEntityRanges(
            (character: CharacterMetadata) => {
                const entityKey: string = character.getEntity();

                if (entityKey === null) {
                    return false;
                }

                return Entity.get(entityKey).getType() === "PROOFREAD_COMMENT";
            },
            callback);
    }

    render(): React.ReactElement<{}> {
        return (
            <div>
                <Editor
                    editorState={this.state.editorState}
                    onChange={this.onChange}
                    readOnly={this.props.readOnly}
                    placeholder={this.props.placeholder}
                />
            </div>
        );
    }
}
