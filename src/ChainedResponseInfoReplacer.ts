export class ChainedResponseInfoReplacer implements ResponseInfoReplacer {
  private readonly replacers: ResponseInfoReplacer[];

  constructor(replacers: ResponseInfoReplacer[]) {
    this.replacers = replacers;

  }

  replace(responseInfo: chrome.webRequest.WebResponseCacheDetails, text: string): string {
    for (let replacer of this.replacers) {
      text = replacer.replace(responseInfo, text);
    }

    return text;
  }
}
