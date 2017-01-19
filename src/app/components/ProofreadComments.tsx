import * as React from "react";

import {IProofreadComment} from "../stores/ProofreadStore";

interface IProofreadCommentsProp {
    comment: IProofreadComment;
}

export default class ProofreadComments extends React.Component<IProofreadCommentsProp, {}> {
    render(): React.ReactElement<{}> {
        let name: string = (this.props.comment) ? (this.props.comment.hint.name) : ("");
        let description: string = (this.props.comment) ? (this.props.comment.hint.description) : ("");

        name = name.replace(/&nbsp;/gi, " ");
        description = description.replace(/&nbsp;/gi, " ");

        // Add comma at the end of a sentence if needed
        if ((description.length > 0) && (description[description.length - 1] !== ".")) {
            description += ".";
        }

        return (
            <div className="commentsSection">
                <span className="ms-font-xl ms-fontWeight-semibold">{name}</span>
                <p className="ms-font-s-plus">{description}</p>
            </div>
        );
    }
}