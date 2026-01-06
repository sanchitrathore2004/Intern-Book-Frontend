import type { SubmissionCardResponseDto } from "../../web-client/src/generated";
import SubmissionCard from "../components/SubmissionCard";

interface Props {
	submissions: SubmissionCardResponseDto[];
}

const FetchedSubmission = ({ submissions }: Props) => {
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
					<div key={submission.id} className="w-[22vmax] h-[28vmax]">
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
