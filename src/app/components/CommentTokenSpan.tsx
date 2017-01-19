import * as React from "react";
import * as PubSubJs from "pubsub-js";

export default class CommentTokenSpan extends React.Component<{entityKey: string}, {}> {
    constructor(props: {entityKey: string}) {
        super();

        this.state = {hover: false};
    }

    onMouseEnter: (event: React.SyntheticEvent) => void = (event: React.SyntheticEvent) => {
        PubSubJs.publish("SELECTED_ENTITY_CHANGED", this.props.entityKey);
    };

    onMouseLeave: (event: React.SyntheticEvent) => void = (event: React.SyntheticEvent) => {
        PubSubJs.publish("SELECTED_ENTITY_CHANGED", null);
    };

    render(): React.ReactElement<{}> {
        return (
            <span {...this.props} className="comment-underline"
                    onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                {this.props.children}
            </span>
        );
    }
}
