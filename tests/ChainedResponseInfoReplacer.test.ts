import ResourceType = chrome.webRequest.ResourceType;
import {LegacyResponseInfoReplacer} from "../src/LegacyResponseInfoReplacer";
import {ChainedResponseInfoReplacer} from "../src/ChainedResponseInfoReplacer";
import {MustacheResponseInfoReplacer} from "../src/MustacheResponseInfoReplacer";

const requestInfo = {
  'ip': '1.2.3.4',
  'method': 'GET',
  'responseHeaders': [
    {
      'name': 'X-Server',
      'value': 'web1'
    }
  ],
  'statusLine': 'OK',
  'statusCode': 200,
  'url': 'https://www.example.com/',
  'requestId': '1234',
  'frameId': 2345,
  'parentFrameId': 3456,
  'tabId': 4567,
  'type': 'main_frame' as ResourceType,
  'timeStamp': 5678,
  'fromCache': false
};

const replacer = new ChainedResponseInfoReplacer([
  new LegacyResponseInfoReplacer(false),
  new MustacheResponseInfoReplacer()
]);

describe('LegacyResponseInfoReplacer', () => {
  it('should chain multiple replacers', () => {
    expect(replacer.replace(requestInfo, '%statusLine% {{statusLine}}')).toBe('OK OK');
  });
});
