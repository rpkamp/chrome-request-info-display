import Mustache = require("mustache");
import HttpHeader = chrome.webRequest.HttpHeader;

export class MustacheResponseInfoReplacer implements ResponseInfoReplacer
{
  replace(responseInfo: WebResponseCacheDetails, text: string): string {
    const headers: { [s: string]: string } = {};
    const responseHeaders = responseInfo.responseHeaders;

    const toCamelCase = (input: string) => {
      return input.toLowerCase().replace(/([-_][a-z])/ig, (match: string) => {
        return match.toUpperCase()
          .replace('-', '')
          .replace('_', '');
      });
    };

    if (typeof responseHeaders !== 'undefined') {
      responseHeaders.forEach((header: HttpHeader) => {
        headers[toCamelCase(header.name)] = header.value || '';
      })
    }

    const view = {
      ip: responseInfo.ip || '',
      statusCode: responseInfo.statusCode,
      statusLine: responseInfo.statusLine,
      url: responseInfo.url,
      method: responseInfo.method,
      initiator: responseInfo.initiator,
      headers: headers,
      fromCache: responseInfo.fromCache
    };

    return Mustache.render(text, view);
  }
}
