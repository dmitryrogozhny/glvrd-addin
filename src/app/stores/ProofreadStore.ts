/* tslint:disable */
declare let glvrd: any;
/* tslint:enable */

interface IProofreadResult {
    status: string;
    score: number;
    fragments: Array<IProofreadComment>;

    message?: string;
}

interface IProofreadComment {
    start: number;
    end: number;
    phrase: string;
    url: string;
    hint: {description: string, name: string};
}

const okStatus: string = "ok";

type PromiseResolver = (value?: {}) => void;

class GlvrdStore {
    public proofread(content: string): Promise<IProofreadResult> {
        let promise: Promise<IProofreadResult> = new Promise(function(resolve: PromiseResolver, reject: PromiseResolver): void {
            if (glvrd === undefined) {
                console.log("glvrd not initialized");
                // Add error processing
                reject("glvrd not initialized");
            } else {
                glvrd.getStatus(function(result: {status: string, message: string}): void {
                    if (result.status === okStatus) {
                        glvrd.proofread(content, function(result: IProofreadResult): void {
                            if (result.status === okStatus) {
                                for (let fragment of result.fragments) {
                                    fragment.phrase = content.substring(fragment.start, fragment.end);
                                }
                                resolve(result);
                            } else {
                                console.log("Error while connecting glvrd: ${result.message}");
                                // Add error processing
                                reject(result.message);                                
                            }
                        });
                    } else {
                        console.log("Error while connecting glvrd: ${result.message}");
                        // Add error processing
                        reject(result.message);
                    }
                });
            }
        });

        return promise;
    }
}

export {IProofreadResult, IProofreadComment};
export let ProofreadStore = new GlvrdStore();