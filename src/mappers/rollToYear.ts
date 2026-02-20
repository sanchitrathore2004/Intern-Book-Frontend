export function getBatchFromRoll(userId: number | undefined | null): string {
	if (userId === undefined || userId === null) return "";
	const rollstr = userId.toString();

	const programType = rollstr.charAt(0);
	const yearPart = rollstr.slice(4, 6);
	const startYear = 2000 + Number(yearPart);

	var duration: number;

	if (programType === "1") duration = 4;
	else if (programType === "2") duration = 2;
	else throw new Error("Unknown program type");

	const endYear = startYear + duration;

	return `${startYear}-${endYear}`;
}
