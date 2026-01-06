import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { InfoRow } from "../components/InfoRow.tsx";
import Loader from "../components/Loader.tsx";
import { ProfileBox } from "../components/ProfileBox.tsx";
import TextBox from "../components/TextBox.tsx";
import useGetSubmissions from "../hooks/useGetSubmissions.ts";
import { showError } from "../utils/toast.ts";

function Submission() {
	const { submission_id } = useParams<{ submission_id: string }>();
	const navigate = useNavigate();

	const { submissions, error, fetchSubmission } = useGetSubmissions();

	useEffect(() => {
		if (!submission_id) {
			navigate("/error");
			return;
		}

		const submissionIdNum = Number(submission_id);
		if (Number.isNaN(submissionIdNum)) {
			navigate("/error");
			return;
		}

		const controller = new AbortController();
		fetchSubmission(submissionIdNum, controller);
		return () => controller.abort();
	}, [submission_id, navigate, fetchSubmission]);

	if (error) showError(error.message);
	if (!submissions) return <Loader fullscreen />;

	return (
		<>
			<ToastContainer newestOnTop />
			<div className="grid grid-cols-10 p-4 gap-6">
				<div className="col-span-10 md:col-span-6 w-full">
					<ProfileBox
						submissionId={submissions.id ?? 1}
						isFavourite={submissions.favourite ?? false}
						authorId={submissions.authorId ?? 106123122}
						cgpa={submissions.cgpa != null ? String(submissions.cgpa) : ""}
						profileUrl={
							submissions.profileUrl ?? "https://robohash.org/Phunsi%20Kumar"
						}
						name={submissions.name ?? ""}
						department={submissions.department?.name ?? ""}
						email={submissions.email ?? ""}
						degree={submissions.degree ?? ""}
						year={submissions.year?.toString() ?? ""}
						likeCount={submissions.likeCount ?? 0}
					/>
				</div>

				<div className="col-span-10 md:col-span-4 bg-(--fore-bg) p-5 rounded-[0.75em] md:rounded-[1.5em] w-fit">
					{/*Company Info*/}
					<div className="flex flex-col gap-4">
						<InfoRow
							label="Company"
							value={submissions.company?.name ?? ""}
							companyId={submissions.company?.id}
						/>
						<InfoRow
							label="Company Role"
							value={submissions.role?.name ?? ""}
						/>
						<InfoRow label="Selection Type" value={submissions.type ?? ""} />
						<InfoRow
							label="Selected At"
							value={`${submissions.createdAt?.getDay()} ${submissions.createdAt?.getMonth()}`}
						/>
						{submissions.type === "INTERN" ? (
							<InfoRow
								label="Stipend"
								value={submissions.stipend?.toString() ?? ""}
							/>
						) : (
							<InfoRow label="Ctc" value={submissions.ctc?.toString() ?? ""} />
						)}
						<InfoRow
							label="Ot rounds"
							value={submissions.processStructure?.otRound?.toString() ?? ""}
						/>
						<InfoRow
							label="Pi rounds"
							value={submissions.processStructure?.piRound?.toString() ?? ""}
						/>
						<InfoRow
							label="Duration"
							value={`${submissions.processStructure?.startDate?.getDay()} ${submissions.processStructure?.startDate?.getMonth()} ${submissions.processStructure?.startDate?.getFullYear()} - ${submissions.processStructure?.endDate?.getDate()} ${submissions.processStructure?.endDate?.getMonth()} ${submissions.processStructure?.endDate?.getFullYear()}`}
						/>
					</div>
				</div>

				<TextBox label="Experience" value={submissions.experience ?? ""} />
				{submissions.mistakes && (
					<TextBox label="Mistakes" value={submissions.mistakes ?? ""} />
				)}
				{submissions.resources && (
					<TextBox label="Resources" value={submissions.resources ?? ""} />
				)}
				{submissions.benefits && (
					<TextBox label="Benefits" value={submissions.benefits ?? ""} />
				)}
				{submissions.clubPositions && (
					<TextBox
						label="Club Positions"
						value={submissions.clubPositions ?? ""}
					/>
				)}
			</div>
		</>
	);
}

export default Submission;
