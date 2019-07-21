export default class {
	private regexp: RegExp;

	constructor(pattern: string) {
		this.regexp = new RegExp(pattern, 'i');
	}

	matches(input: string) {
		return this.regexp.test(new URL(input).hostname);
	}
}
