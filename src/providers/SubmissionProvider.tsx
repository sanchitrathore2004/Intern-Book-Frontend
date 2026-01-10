import { useState } from "react";
import type { SubmissionCardResponseDto } from "../../web-client/src/generated";
import { SubmissionContext } from "../contexts/SubmissionContext";

export const SubmissionProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [submissions, setSubmissions] = useState<SubmissionCardResponseDto[]>(
		[],
	);

	return (
		<SubmissionContext.Provider
			value={{
				submissions,
				setSubmissions,
			}}
		>
			{children}
		</SubmissionContext.Provider>
	);
};
