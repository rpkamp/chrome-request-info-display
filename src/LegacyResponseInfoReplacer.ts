import HttpHeader = chrome.webRequest.HttpHeader;
import WebResponseCacheDetails = chrome.webRequest.WebResponseCacheDetails;

export class LegacyResponseInfoReplacer implements ResponseInfoReplacer
{
  private showDeprecationNotice: boolean;

  constructor(showDeprecationNotice: boolean = true) {
    this.showDeprecationNotice = showDeprecationNotice;
  }

  replace(responseInfo: WebResponseCacheDetails, text: string): string {
    const originalText = text;

    if (typeof responseInfo.responseHeaders !== 'undefined') {
      responseInfo.responseHeaders.forEach((header: HttpHeader) => {
        text = text.replace(`%header:${header.name.toLowerCase()}%`, header.value || '');
      })
    }

    for (let [property, value] of Object.entries(responseInfo)) {
      if (!responseInfo.hasOwnProperty(property)) {
        continue;
      }

      if (typeof value === 'string') {
        text = text.replace(`%${property}%`, value);
      }

      if (typeof value === 'number') {
        text = text.replace(`%${property}%`, String(value));
      }
    }

    text = text.replace(/%.*?%/g, '<i>undefined</i>');

    if (this.showDeprecationNotice && originalText !== text) {
      text = text + '<br /><small><em>% Placeholders like %ip% have been deprecated. Please update your configuration.</em></small>';
    }

    return text;
  }
}
