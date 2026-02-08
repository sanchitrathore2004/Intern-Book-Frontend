import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { InfoRow } from "../components/InfoRow.tsx";
import Loader from "../components/Loader.tsx";
import { ProfileBox } from "../components/ProfileBox.tsx";
import TextBox from "../components/TextBox.tsx";
import useGetSubmissions from "../hooks/useGetSubmissions.ts";
import { showError } from "../utils/toast.ts";

function ordinal(day: number) {
	const mod100 = day % 100;
	if (mod100 >= 11 && mod100 <= 13) return `${day}th`;
	switch (day % 10) {
		case 1:
			return `${day}st`;
		case 2:
			return `${day}nd`;
		case 3:
			return `${day}rd`;
		default:
			return `${day}th`;
	}
}

function formatDayMonth(date?: Date) {
	if (!date || Number.isNaN(date.getTime())) return "";
	const day = ordinal(date.getDate());
	const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(
		date,
	);
	const year = date.getFullYear();
	return `${day} ${month} ${year}`;
}

function formatMonthYear(date?: Date) {
	if (!date || Number.isNaN(date.getTime())) return "";
	return new Intl.DateTimeFormat("en-GB", {
		month: "short",
		year: "numeric",
	}).format(date);
}

function Submission() {
	const { submission_id } = useParams<{ submission_id: string }>();
	const navigate = useNavigate();
	const submissionId = Number(submission_id);
	const {
		data: submissions,
		isLoading: loading,
		error,
	} = useGetSubmissions(submissionId);

	useEffect(() => {
		if (!submission_id || Number.isNaN(submissionId)) {
			navigate("/error");
		}
	}, [submission_id, submissionId, navigate]);

	useEffect(() => {
		if (error) {
			showError(error?.message ?? "error");
			navigate("/error");
		}
	}, [error, navigate]);

	useEffect(() => {
		if (error) {
			showError(error.message);
			navigate("/error");
		}
	}, [error, navigate]);

	const isAnonymous = submissions?.isAnonymous ?? false;

	if (loading) return <Loader fullscreen />;
	if (!submissions) return null;

	return (
		<>
			<ToastContainer newestOnTop />
			<div className="grid grid-cols-10 p-4 gap-6">
				<div className="col-span-10 md:col-span-6 w-full">
					<ProfileBox
						submissionId={submissions.id ?? 1}
						isFavourite={submissions.favourite ?? false}
						authorId={submissions.authorId ?? 106123122}
						cgpa={
							isAnonymous
								? "NA"
								: submissions.cgpa != null
									? String(submissions.cgpa)
									: "NA"
						}
						profileUrl={
							isAnonymous
								? "https://robohash.org/anonymous"
								: (submissions.profileUrl ??
									`https://robohash.org/${submissions.name}`)
						}
						name={isAnonymous ? "Anonymous" : (submissions.name ?? "")}
						department={isAnonymous ? "" : (submissions.department?.name ?? "")}
						email={isAnonymous ? "" : (submissions.email ?? "")}
						degree={submissions.degree ?? ""}
						year={isAnonymous ? "" : (submissions.year?.toString() ?? "")}
						likeCount={submissions.likeCount ?? 0}
						isAnonymous={isAnonymous}
					/>
				</div>

				<div className="col-span-10 md:col-span-4 bg-(--fore-bg) p-5 rounded-[0.75em] md:rounded-[1.5em] w-fit">
					{/*Company Info*/}
					<div className="flex flex-col gap-4">
						<InfoRow
							label="Company"
							value={submissions.company?.name}
							companyId={submissions.company?.id}
						/>
						<InfoRow label="Domain" value={submissions.domain?.domainName} />
						<InfoRow label="Selection Type" value={submissions.type} />
						<InfoRow
							label="Created At"
							value={formatDayMonth(submissions.createdAt)}
						/>
						<InfoRow
							label="Ot rounds"
							value={submissions.processStructure?.otRound?.toString()}
						/>
						<InfoRow
							label="Pi rounds"
							value={submissions.processStructure?.piRound?.toString()}
						/>
						<InfoRow
							label="Duration"
							value={
								formatMonthYear(submissions.processStructure?.startDate) &&
								formatMonthYear(submissions.processStructure?.endDate)
									? `${formatMonthYear(
											submissions.processStructure?.startDate,
										)} - ${formatMonthYear(
											submissions.processStructure?.endDate,
										)}`
									: "NA"
							}
						/>
					</div>
				</div>
				{submissions.domainDescription && (
					<TextBox
						label="Role Description"
						value={submissions.domainDescription ?? ""}
					/>
				)}
				<TextBox label="Experience" value={submissions.experience ?? ""} />
				{submissions.resources && (
					<TextBox label="Resources" value={submissions.resources ?? ""} />
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
