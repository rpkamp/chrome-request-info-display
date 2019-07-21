import ResourceType = chrome.webRequest.ResourceType;
import {LegacyResponseInfoReplacer} from "../src/LegacyResponseInfoReplacer";

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

const replacer = new LegacyResponseInfoReplacer(false);

describe('LegacyResponseInfoReplacer', () => {
  it('should replace variables from info in text', () => {
    expect(replacer.replace(requestInfo, '%url% %statusCode%')).toBe('https://www.example.com/ 200');
  });

  it('should replace multiple variables in text', () => {
    expect(replacer.replace(requestInfo, '%url% (%ip%)')).toBe('https://www.example.com/ (1.2.3.4)');
  });

  it('should replace headers from info in text', () => {
     expect(replacer.replace(requestInfo, '%header:x-server%')).toBe('web1');
  });

  it('should replace mix of variables and headers', () => {
    expect(replacer.replace(requestInfo, '%url% (%header:x-server%)')).toBe('https://www.example.com/ (web1)');
  });

  it('should leave HTML in text alone', () => {
    expect(replacer.replace(requestInfo, '%url%<br /><strong>%header:x-server%</strong>')).toBe('https://www.example.com/<br /><strong>web1</strong>');
  });

  it('should return undefined for unknown parameter', () => {
    expect(replacer.replace(requestInfo, '%foo%')).toBe('<i>undefined</i>');
  })
});
