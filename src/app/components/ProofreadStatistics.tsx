import * as React from "react";

import {IProofreadResult} from "../stores/ProofreadStore";
import TranslationHelper from "../utilities/TranslationHelper";

interface IProofreadStatisticsProps {
    proofreadResult: IProofreadResult;
    navigateToLink: string;
}

export default class ProofreadStatistics extends React.Component<IProofreadStatisticsProps, {}> {
    constructor() {
        super();
    }

    render(): React.ReactElement<{}> {
        let scoreNumber: string = "";
        let scoreText: string = "";
        let stopWordsNumber: string = "";
        let stopWordsText: string = "";

        if (this.props.proofreadResult) {
            scoreNumber = this.props.proofreadResult.score.toString();
            scoreText = TranslationHelper.t("scoreText", {count: this.props.proofreadResult.score});
            stopWordsNumber = this.props.proofreadResult.fragments.length.toString();
            stopWordsText = TranslationHelper.t("stopWord", {count: this.props.proofreadResult.fragments.length});
        }

        return (
            <div className="ms-Grid ms-font-s-plus">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-u-sm7">
                        <div className="statisticsSection-number">
                            <span className="ms-font-xxl ms-fontWeight-semibold">{scoreNumber}</span>
                        </div>
                        <div className="statisticsSection-description">
                            <span>{scoreText}</span><br/>
                            <span>{TranslationHelper.t("byGlvrdScale")}</span>
                        </div>
                    </div>
                    <div className="ms-Grid-col ms-u-sm5">
                        <div className="statisticsSection-number">
                            <span className="ms-font-xxl ms-fontWeight-semibold">{stopWordsNumber}</span>
                        </div>
                        <div className="statisticsSection-description statisticsSection-description--singleLine">
                            <span>{stopWordsText}</span>
                        </div>
                    </div>
                </div>
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-u-sm7">
                        <div className={((this.props.navigateToLink != null) && (this.props.navigateToLink !== ""))  ? "" : "displayNone"}>
                            <a  href={this.props.navigateToLink}
                                target="_blank">{TranslationHelper.t("openInGlvrd")}</a>
                        </div>
                    </div>
                    <div className="ms-Grid-col ms-u-sm5">
                        <a href={TranslationHelper.t("aboutUrl")} target="_blank">                            
                            {TranslationHelper.t("about")}
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}