import { z } from "zod";

export const submissionSchema = z.object({
	company: z.string().min(1, "Company is required"),
	role: z.string().min(1, "Role is required"),
	type: z.enum(["INTERN", "PLACED", "INTERN_TO_PPO"]),

	experience: z.string(),
	benefits: z.string().optional(),
	mistakes: z.string().optional(),
	resources: z.string().optional(),
	cgpa: z.coerce.number().min(0).max(10).optional(),

	clubPositions: z.string().max(1000).optional(),
	ctc: z.coerce.number().min(0).optional(),
	basePay: z.coerce.number().min(0).optional(),
	stipend: z.coerce.number().min(0).optional(),
	otRounds: z.coerce.number().min(0).optional(),
	piRounds: z.coerce.number().min(0).optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
