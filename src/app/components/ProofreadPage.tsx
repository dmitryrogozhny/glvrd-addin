import * as React from "react";

import {ProofreadStore, IProofreadResult, IProofreadComment} from "../stores/ProofreadStore";

import DetailsSection from "./DetailsSection";
import ProofreadEditor from "./ProofreadEditor";

interface IProofreadPageProps {
    content?: string;
    placeholder?: string;
}

interface IProofreadPageState {
    content?: string;
    proofreadResult?: IProofreadResult;
    activeComment?: IProofreadComment;
}

const readOnly: boolean = true;

export default class ProofreadPage extends React.Component<IProofreadPageProps, IProofreadPageState> {
    constructor(props: IProofreadPageProps) {
        super();
        this.state = {content: props.content, proofreadResult: null};

        ProofreadStore.proofread(this.state.content).then(this.processProofreadResults);
    }

    processProofreadResults: (result: IProofreadResult) => void = (result: IProofreadResult): void => {
        // Set only proofread result in the state.
        // Do not set the content as it might change in the editor while proofreading.
        this.setState({proofreadResult: result});
    }

    onEditorContentChange: (content: string) => void = (content: string) => {
        ProofreadStore.proofread(content).then(this.processProofreadResults);
    }

    componentWillReceiveProps(nextProps: IProofreadPageProps): void {
        // If a new content has been specified from outside, set it to the state to trigger change.
        if (this.props.content !== nextProps.content) {
            this.setState({content: nextProps.content, proofreadResult: null});
            ProofreadStore.proofread(nextProps.content).then(this.processProofreadResults);
        }
    }

    render(): React.ReactElement<{}> {
        return (            
            <div className="editorPage">
                <div className="editorSection">
                    <ProofreadEditor
                        content={this.state.content}
                        proofreadResult={this.state.proofreadResult}
                        onContentChange={this.onEditorContentChange}
                        placeholder={this.props.placeholder}
                        readOnly={readOnly}
                    />
                </div>
                <div className="detailsSection">
                    <DetailsSection proofreadResult={this.state.proofreadResult} />
                </div>
            </div>            
        );
    }
}
