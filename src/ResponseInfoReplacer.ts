import WebResponseCacheDetails = chrome.webRequest.WebResponseCacheDetails;

interface ResponseInfoReplacer
{
  replace(responseInfo: WebResponseCacheDetails, text: string): string;
}
