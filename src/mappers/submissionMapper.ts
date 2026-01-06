import type { SaveSubmissionRequestDto } from "../../web-client/src/generated";
import type { SubmissionFormData } from "../interfaces/submissionSchema";

const submissionMapper = (
	form: SubmissionFormData,
): SaveSubmissionRequestDto => ({
	companyId: form.company,
	roleId: form.role,
	type: form.type,

	experience: form.experience,
	benefits: form.benefits || undefined,
	mistakes: form.mistakes || undefined,
	resources: form.resources || undefined,

	cgpa: form.cgpa,
	clubPositions: form.clubPositions,

	ctc: form.ctc,
	basePay: form.basePay,
	stipendValue: form.stipend,

	otRounds: form.otRounds,
	piRounds: form.piRounds,

	startDate: form.startDate ? new Date(form.startDate) : undefined,
	endDate: form.endDate ? new Date(form.endDate) : undefined,
});

export default submissionMapper;
