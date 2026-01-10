import { createContext } from "react";
import type { SubmissionCardResponseDto } from "../../web-client/src/generated";

interface SubmissionContextType {
	submissions: SubmissionCardResponseDto[];
	setSubmissions: React.Dispatch<
		React.SetStateAction<SubmissionCardResponseDto[]>
	>;
}
export const SubmissionContext = createContext<SubmissionContextType | null>(
	null,
);
