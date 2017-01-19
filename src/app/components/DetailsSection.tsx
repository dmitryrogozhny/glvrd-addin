import * as React from "react";
import * as PubSubJs from "pubsub-js";

import {IProofreadResult, IProofreadComment} from "../stores/ProofreadStore";

import ProofreadComments from "./ProofreadComments";
import ProofreadStatistics from "./ProofreadStatistics";

interface IDetailsSectionProps {
    proofreadResult: IProofreadResult;
}

interface IDetailsSectionState {
    activeComment: IProofreadComment;
}

export default class DetailsSection extends React.Component<IDetailsSectionProps, IDetailsSectionState> {
    private commentSubscriber: string;

    constructor() {
        super();

        this.state = {activeComment: null};
    }

    componentDidMount(): void {
        this.commentSubscriber = PubSubJs.subscribe("ACTIVE_COMMENT_CHANGED", (eventId: string, activeComment: IProofreadComment) => {
            this.setState({activeComment: activeComment});
        });
    }

    componentWillUnmount(): void {
        PubSubJs.unsubscribe(this.commentSubscriber);
    }

    render(): React.ReactElement<{}> {
        let navigateToLink: string = null;
        if (this.props.proofreadResult && (this.props.proofreadResult.fragments.length > 0)) {
            navigateToLink = this.props.proofreadResult.fragments[0].url;
        }

        let renderElement: React.ReactElement<{}>;        

        if (this.state.activeComment) {
            renderElement = <ProofreadComments comment={this.state.activeComment} />; 
        } else {
            renderElement = <ProofreadStatistics proofreadResult={this.props.proofreadResult} navigateToLink={navigateToLink} />; 
        }
        return renderElement;
    }
}