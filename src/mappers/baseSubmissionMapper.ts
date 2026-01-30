import type { SaveSubmissionRequestDto } from "../../web-client/src/generated";
import type { SubmissionFormData } from "../interfaces/submissionSchema";

export const baseSubmissionMapper = (
	form: SubmissionFormData,
): SaveSubmissionRequestDto => ({
	companyId: form.company,
	domainId: form.domain,
	type: form.type,

	experience: form.experience,
	domainDescription: form.domainDescription || undefined,
	resources: form.resources || undefined,

	cgpa: form.cgpa ?? undefined,
	clubPositions: form.clubPositions,

	ctc: form.ctc ?? undefined,
	basePay: form.basePay ?? undefined,
	stipendValue: form.stipend ?? undefined,

	otRounds: form.otRounds ?? undefined,
	piRounds: form.piRounds ?? undefined,

	startDate: form.startDate ? new Date(form.startDate) : undefined,
	endDate: form.endDate ? new Date(form.endDate) : undefined,
});
