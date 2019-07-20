import ResourceType = chrome.webRequest.ResourceType;
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

const replacer = new MustacheResponseInfoReplacer();

describe('MustacheResponseInfoReplacer', () => {
  it('should replace variables from info in text', () => {
    expect(replacer.replace(requestInfo, '{{url}} {{statusCode}}')).toBe('https:&#x2F;&#x2F;www.example.com&#x2F; 200');
  });

  it('should work when there is no IP', () => {
    let info = { ... requestInfo };
    delete info.ip;

    expect(replacer.replace(info, '{{ip}}')).toBe('');
  });

  it('should replace multiple variables in text', () => {
    expect(replacer.replace(requestInfo, '{{url}} ({{ip}})')).toBe('https:&#x2F;&#x2F;www.example.com&#x2F; (1.2.3.4)');
  });

  it('should replace headers from info in text', () => {
    expect(replacer.replace(requestInfo, '{{headers.xServer}}')).toBe('web1');
  });

  it('should replace mix of variables and headers', () => {
    expect(replacer.replace(requestInfo, '{{url}} ({{headers.xServer}})')).toBe('https:&#x2F;&#x2F;www.example.com&#x2F; (web1)');
  });

  it('should leave HTML in text alone', () => {
    expect(
      replacer.replace(requestInfo, '{{url}}<br /><strong>{{headers.xServer}}</strong>')
    ).toBe('https:&#x2F;&#x2F;www.example.com&#x2F;<br /><strong>web1</strong>');
  });

  it('should replace undefined parameter with empty string', () => {
    expect(replacer.replace(requestInfo, '{{foo}}')).toBe('');
  });

  it('should support conditionals', () => {
    expect(replacer.replace(requestInfo, '{{#ip}}IP: {{ip}}{{/ip}}')).toBe('IP: 1.2.3.4');
  });
});
