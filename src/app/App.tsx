import * as React from "react";

import ProofreadPage from "./components/ProofreadPage";
import TranslationHelper from "./utilities/TranslationHelper";

export default class App extends React.Component<{}, {content: string}> {

    constructor() {
        super();

        console.log(Office.context.displayLanguage);

        TranslationHelper.init(Office.context.displayLanguage);

        this.state = {content: ""};
        Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, this.onSelectionChange);
    }

    onSelectionChange: (eventArgs: {}) => void = (eventArgs: {}) => {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, (asyncResult: Office.AsyncResult) => {
            if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                console.log("Action failed. Error: " + asyncResult.error.message);
            } else {
                this.setState({content: asyncResult.value});
            }
        });
    }

    componentWillMount(): void {
        // If a text has been selected before the add-in loaded, use it for processing.
        this.onSelectionChange({});
    }

    render(): React.ReactElement<{}> {
        return (
            <ProofreadPage content={this.state.content} placeholder={TranslationHelper.t("editorPlaceholder")} />
        );
    }
}
