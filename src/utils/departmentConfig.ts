export class DepartmentConfig {
	private departmentMap: Map<string, string>;

	constructor() {
		this.departmentMap = new Map<string, string>();

		this.departmentMap.set("CSE", "Computer Science & Engineering");
		this.departmentMap.set("ECE", "Electronics & Communication Engineering");
		this.departmentMap.set("EEE", "Electrical & Electronics Engineering");
		this.departmentMap.set("ICE", "Instrumentation & Control Engineering");
		this.departmentMap.set("MECH", "Mechanical Engineering");
		this.departmentMap.set("CHEM", "Chemical Engineering");
		this.departmentMap.set("CIVIL", "Civil Engineering");
		this.departmentMap.set("MME", "Metallurgical & Materials Engineering");
		this.departmentMap.set("PROD", "Production Engineering");
	}

	getDepartment(code: string): string | undefined {
		return this.departmentMap.get(code);
	}
}
