import WebResponseHeadersDetails = chrome.webRequest.WebResponseHeadersDetails;
import HttpHeader = chrome.webRequest.HttpHeader;

export default function(requestInfo: WebResponseHeadersDetails, text: string): string {
  if (typeof requestInfo.responseHeaders !== 'undefined') {
    requestInfo.responseHeaders.forEach((header: HttpHeader) => {
      text = text.replace(`%header:${header.name.toLowerCase()}%`, header.value || '');
    })
  }

  for (let [property, value] of Object.entries(requestInfo)) {
    if (!requestInfo.hasOwnProperty(property)) {
      continue;
    }

    if (typeof value === 'string') {
      text = text.replace(`%${property}%`, value);
    }

    if (typeof value === 'number') {
      text = text.replace(`%${property}%`, String(value));
    }
  }

  return text.replace(/%.*?%/g, '<i>undefined</i>');
}
