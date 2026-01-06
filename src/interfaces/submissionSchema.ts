import { z } from "zod";

const nullableNumber = z.preprocess((val) => {
	if (val === "" || val === undefined || val === null) return null;
	return val;
}, z.number().nullable());

export const submissionSchema = z
	.object({
		company: z.coerce.number().min(1, "Company is required"),
		role: z.coerce.number().min(1, "Role is required"),

		type: z.enum(["INTERN", "PLACED", "INTERN_TO_PPO"]),

		experience: z
			.string()
			.min(50, "Experience should be of minimum 50 characters"),

		benefits: z.string().optional(),
		mistakes: z.string().optional(),
		resources: z.string().optional(),

		cgpa: nullableNumber.refine((v) => v === null || (v >= 0 && v <= 10), {
			message: "CGPA must be between 0 and 10",
		}),

		clubPositions: z.string().max(1000).optional(),

		ctc: nullableNumber.refine((v) => v === null || v >= 0, {
			message: "CTC must be positive",
		}),

		basePay: nullableNumber.refine((v) => v === null || v >= 0, {
			message: "Base pay must be positive",
		}),

		stipend: nullableNumber.refine((v) => v === null || v >= 0, {
			message: "Stipend must be positive",
		}),

		otRounds: nullableNumber.refine((v) => v === null || v >= 0, {
			message: "OT rounds must be positive",
		}),

		piRounds: nullableNumber.refine((v) => v === null || v >= 0, {
			message: "PI rounds must be positive",
		}),

		startDate: z.string().optional(),
		endDate: z.string().optional(),
	})
	.refine(
		(data) => {
			if (!data.startDate || !data.endDate) return true;
			return new Date(data.endDate) > new Date(data.startDate);
		},
		{
			message: "End date must be after start date",
			path: ["endDate"],
		},
	);

export type SubmissionFormData = z.infer<typeof submissionSchema>;
