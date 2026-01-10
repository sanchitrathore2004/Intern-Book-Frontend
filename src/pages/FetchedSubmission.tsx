import SubmissionCard from "../components/SubmissionCard";
import { useSubmissions } from "../hooks/useSubmissions";

const FetchedSubmission = () => {
	const { submissions } = useSubmissions();
	return (
		<>
			{submissions.map((submission) => {
				if (
					!submission.id ||
					!submission.companyName ||
					!submission.userName ||
					!submission.year ||
					!submission.tags
				) {
					return null;
				}
				return (
					<div key={submission.id} className="w-[22vmax] h-[29vmax]">
						<SubmissionCard
							id={submission.id}
							companyLogoUrl={submission.companyLogoUrl}
							companyName={submission.companyName}
							role={submission.role}
							tags={submission.tags}
							type={submission.submissionType}
							userName={submission.userName}
							year={submission.year}
							isFavourite={submission.favourite}
							likeCount={submission.likeCount}
						/>
					</div>
				);
			})}
		</>
	);
};

export default FetchedSubmission;
