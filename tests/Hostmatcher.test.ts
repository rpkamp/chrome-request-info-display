import HostMatcher from '../src/HostnameMatcher';

describe('HostMatcher', () => {
  it('should match when host matches', () => {
    const matcher = new HostMatcher('www\.example\.com');
    const input = 'https://www.example.com/foo/bar';

    expect(matcher.matches(input)).toBeTruthy();
  });

  it('should match when host matches partially', () => {
    const matcher = new HostMatcher('example\.com');
    const input = 'https://www.example.com/foo/bar';

    expect(matcher.matches(input)).toBeTruthy();
  });

  it('should match when host matches and non-default port is used', () => {
    const matcher = new HostMatcher('www\.example\.com');
    const input = 'https://www.example.com:8080/foo/bar';

    expect(matcher.matches(input)).toBeTruthy();
  });

  it('should not match when host does not match', () => {
    const matcher = new HostMatcher('www\.example\.com');
    const input = 'https://www.bbc.co.uk/';

    expect(matcher.matches(input)).toBeFalsy();
  });

  it('should not match when host is in URL but not the hostname', () => {
    const matcher = new HostMatcher('www\.example\.com');
    const input = 'https://www.bbc.co.uk/?q=www.example.com';

    expect(matcher.matches(input)).toBeFalsy();
  });
});
