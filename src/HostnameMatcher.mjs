export default class {
	constructor(pattern) {
		this.regexp = new RegExp(pattern, 'i');
	}

	matches(input) {
		if (typeof input !== 'string') {
			throw new TypeError('HostnameMatcher.matches expects a string as argument');
		}

		return this.regexp.test(new URL(input).hostname);
	}
}
