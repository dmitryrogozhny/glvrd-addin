import resources from "../resources/resources";
import * as i18next from "i18next";

class TranslationHelper {
    init(language: string): void {
        const lang: string = language.toLowerCase(); 

        i18next.init({
            lng: lang,
            "debug": true,
            resources: resources
        });
    }

    t(key: string, options?: any): string {
        return i18next.t(key, options);
    }
}

export default new TranslationHelper();