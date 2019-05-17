import replaceRequestInfo from '../src/replaceRequestInfo';
import chai from 'chai';

const expect = chai.expect;

describe('ReplaceRequestInfo', () => {
  it('should replace variables from info in text', () => {
    const info = {
      'host': 'www.example.com'
    };

    expect(replaceRequestInfo(info, '%host%')).to.equal('www.example.com');
  });

  it('should replace multiple variables in text', () => {
    const info = {
      'host': 'www.example.com',
      'ip': '1.2.3.4'
    };

    expect(replaceRequestInfo(info, '%host% (%ip%)')).to.equal('www.example.com (1.2.3.4)');
  });

  it('should replace headers from info in text', () => {
     const info = {
       'responseHeaders': [
         {'name': 'X-Server', 'value': 'web1'}
       ]
     };

     expect(replaceRequestInfo(info, '%header:x-server%')).to.equal('web1');
  });

  it('should replace mix of variables and headers', () => {
    const info = {
      'host': 'www.example.com',
      'responseHeaders': [
        {'name': 'X-Server', 'value': 'web1'}
      ]
    };

    expect(replaceRequestInfo(info, '%host% (%header:x-server%)')).to.equal('www.example.com (web1)');
  });

  it('should leave HTML in text alone', () => {
    const info = {
      'host': 'www.example.com',
      'responseHeaders': [
        {'name': 'X-Server', 'value': 'web1'}
      ]
    };

    expect(replaceRequestInfo(info, '%host%<br /><strong>%header:x-server%</strong>')).to.equal('www.example.com<br /><strong>web1</strong>');
  });

  it('should return undefined for unknown parameter', () => {
    expect(replaceRequestInfo({}, '%foo%')).to.equal('<i>undefined</i>');
  })
});
