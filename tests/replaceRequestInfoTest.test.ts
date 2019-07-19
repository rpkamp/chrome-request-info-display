import replaceRequestInfo from '../src/replaceRequestInfo';
import ResourceType = chrome.webRequest.ResourceType;

const requestInfo = {
  'host': 'www.example.com',
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
  'timeStamp': 5678
};

describe('ReplaceRequestInfo', () => {
  it('should replace variables from info in text', () => {
    expect(replaceRequestInfo(requestInfo, '%host%')).toBe('www.example.com');
  });

  it('should replace multiple variables in text', () => {
    expect(replaceRequestInfo(requestInfo, '%host% (%ip%)')).toBe('www.example.com (1.2.3.4)');
  });

  it('should replace headers from info in text', () => {
     expect(replaceRequestInfo(requestInfo, '%header:x-server%')).toBe('web1');
  });

  it('should replace mix of variables and headers', () => {
    expect(replaceRequestInfo(requestInfo, '%host% (%header:x-server%)')).toBe('www.example.com (web1)');
  });

  it('should leave HTML in text alone', () => {
    expect(replaceRequestInfo(requestInfo, '%host%<br /><strong>%header:x-server%</strong>')).toBe('www.example.com<br /><strong>web1</strong>');
  });

  it('should return undefined for unknown parameter', () => {
    expect(replaceRequestInfo(requestInfo, '%foo%')).toBe('<i>undefined</i>');
  })
});
