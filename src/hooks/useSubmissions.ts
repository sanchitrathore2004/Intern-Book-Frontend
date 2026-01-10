import { useContext } from "react";
import { SubmissionContext } from "../contexts/SubmissionContext";

export const useSubmissions = () => {
	const ctx = useContext(SubmissionContext);
	if (!ctx)
		throw new Error("useSubmissions must be used inside SubmissionProvider");

	return ctx;
};
