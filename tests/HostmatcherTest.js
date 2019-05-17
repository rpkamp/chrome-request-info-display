import HostMatcher from '../src/HostnameMatcher';
import chai from 'chai';

const expect = chai.expect;

describe('HostMatcher', () => {
  it('should match when host matches', () => {
    const matcher = new HostMatcher('www\.example\.com');
    const input = 'https://www.example.com/foo/bar';

    expect(matcher.matches(input)).to.be.true;
  });

  it('should match when host matches partially', () => {
    const matcher = new HostMatcher('example\.com');
    const input = 'https://www.example.com/foo/bar';

    expect(matcher.matches(input)).to.be.true;
  });

  it('should match when host matches and non-default port is used', () => {
    const matcher = new HostMatcher('www\.example\.com');
    const input = 'https://www.example.com:8080/foo/bar';

    expect(matcher.matches(input)).to.be.true;
  });

  it('should not match when host does not match', () => {
		const matcher = new HostMatcher('www\.example\.com');
    const input = 'https://www.bbc.co.uk/';

		expect(matcher.matches(input)).to.be.false;
	});

	it('should not match when host is in URL but not the hostname', () => {
		const matcher = new HostMatcher('www\.example\.com');
    const input = 'https://www.bbc.co.uk/?q=www.example.com';

		expect(matcher.matches(input)).to.be.false;
	});

	it('should throw error when input is not a string', () => {
    const matcher = new HostMatcher('www\.example\.com');
    const input = { url: 'https://www.bbc.co.uk/?q=www.example.com' };

    expect(() => { matcher.matches(input) }).to.throw();
  });
});
