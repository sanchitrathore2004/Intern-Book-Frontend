import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	type GetSubmissionByIdRequest,
	SubmissionControllerApi,
	type SubmissionResponseDto,
} from "../../web-client/src/generated/index.ts";
import { InfoRow } from "../components/InfoRow.tsx";
import { ProfileBox } from "../components/ProfileBox.tsx";
import TextBox from "../components/TextBox.tsx";
import { apiConfig } from "../utils/apiConfig.ts";
import ErrorPage from "./ErrorPage.tsx";

function Submission() {
	const { submission_id } = useParams<{ submission_id: string }>();
	const [data, setData] = useState<SubmissionResponseDto | null>(null);
	const navigate = useNavigate();

	const getSubmission = useCallback(
		async (submissionId: number, controller: AbortController) => {
			try {
				const request: GetSubmissionByIdRequest = { submissionId };
				const submissionApi = new SubmissionControllerApi(apiConfig);

				const res: SubmissionResponseDto =
					await submissionApi.getSubmissionById(request, {
						signal: controller.signal,
					});
				if (!res) throw new Error("Some error occured");

				setData(res);
			} catch (er: unknown) {
				const msg = er instanceof Error ? er.message : String(er);
				console.error("Submission fetch failed:", msg);
				navigate("/error");
			}
		},
		[navigate],
	);

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
		getSubmission(submissionIdNum, controller);
		return () => controller.abort();
	}, [submission_id, getSubmission, navigate]);

	if (!data) return <ErrorPage />;

	return (
		<div className="grid grid-cols-10 p-4 gap-6">
			<div className="col-span-10 md:col-span-6 w-full">
				<ProfileBox
					cgpa={data.cgpa != null ? String(data.cgpa) : ""}
					profileUrl={data.profileUrl ?? ""}
					name={data.name ?? ""}
					department={data.department?.name ?? ""}
					email={data.email ?? ""}
					degree={data.degree ?? ""}
					year={data.year?.toString() ?? ""}
				/>
			</div>

			<div className="col-span-10 md:col-span-4 bg-(--fore-bg) p-5 rounded-[0.75em] md:rounded-[1.5em] w-fit">
				{/*Company Info*/}
				<div className="flex flex-col gap-4">
					<InfoRow label="Company" value={data.company?.name ?? ""} />
					<InfoRow label="Company Role" value={data.role?.name ?? ""} />
					<InfoRow label="Selection Type" value={data.type ?? ""} />
					<InfoRow
						label="Selected At"
						value={`${data.createdAt?.getDay()} ${data.createdAt?.getMonth()}`}
					/>
					{data.type === "INTERN" ? (
						<InfoRow label="Stipend" value={data.stipend?.toString() ?? ""} />
					) : (
						<InfoRow label="Ctc" value={data.ctc?.toString() ?? ""} />
					)}
					<InfoRow
						label="Ot rounds"
						value={data.processStructure?.otRound?.toString() ?? ""}
					/>
					<InfoRow
						label="Pi rounds"
						value={data.processStructure?.piRound?.toString() ?? ""}
					/>
					<InfoRow
						label="Duration"
						value={`${data.processStructure?.startDate?.getDay()} ${data.processStructure?.startDate?.getMonth()} ${data.processStructure?.startDate?.getFullYear()} - ${data.processStructure?.endDate?.getDate()} ${data.processStructure?.endDate?.getMonth()} ${data.processStructure?.endDate?.getFullYear()}`}
					/>
				</div>
			</div>

			<TextBox label="Experience" value={data.experience ?? ""} />
			{data.mistakes && (
				<TextBox label="Mistakes" value={data.mistakes ?? ""} />
			)}
			{data.resources && (
				<TextBox label="Resources" value={data.resources ?? ""} />
			)}
			{data.benefits && (
				<TextBox label="Benefits" value={data.benefits ?? ""} />
			)}
			{data.clubPositions && (
				<TextBox label="Club Positions" value={data.clubPositions ?? ""} />
			)}
		</div>
	);
}

export default Submission;
