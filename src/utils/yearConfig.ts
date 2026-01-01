export class YearConfig {
	private yearMap: Map<string, string>;

	constructor() {
		this.yearMap = new Map<string, string>();
		this.yearMap.set("1", "First Year");
		this.yearMap.set("2", "Second Year");
		this.yearMap.set("3", "Third Year");
		this.yearMap.set("4", "Fourth Year");
		this.yearMap.set("5", "Fifth Year");
	}

	getYear(year: string): string | undefined {
		return this.yearMap.get(year);
	}
}
