import { InfoRow } from "../components/InfoRow.tsx";
import { ProfileBox } from "../components/ProfileBox.tsx";
import TextBox from "../components/TextBox.tsx";
import submissionResponse from "../mocks/submissionResponse.json";

export const Submission = () => {
	return (
		<div className="grid grid-cols-10 p-4 gap-6">
			<div className="col-span-10 md:col-span-6 w-full">
				<ProfileBox cgpa={submissionResponse.cgpa.toString()} />
			</div>
			<div className="col-span-10 md:col-span-4 bg-(--fore-bg) p-5 rounded-[0.75em] md:rounded-[1.5em] w-fit">
				{/*Company Info*/}
				<div className="flex flex-col gap-4">
					<InfoRow label="Company" value={submissionResponse.company.name} />
					<InfoRow label="Company Role" value={submissionResponse.role.name} />
					<InfoRow label="Selection Type" value={submissionResponse.type} />
					<InfoRow label="Selected At" value={submissionResponse.createdAt} />
					{submissionResponse.type === "INTERN" ? (
						<InfoRow label="Stipend" value={submissionResponse.stipend} />
					) : (
						<InfoRow label="Ctc" value={submissionResponse.ctc} />
					)}
					<InfoRow
						label="Ot rounds"
						value={submissionResponse.processStructure.otRound.toString()}
					/>
					<InfoRow
						label="Pi rounds"
						value={submissionResponse.processStructure.piRound.toString()}
					/>
					<InfoRow
						label="Duration"
						value={`${submissionResponse.processStructure.startDate} - ${submissionResponse.processStructure.endDate}`}
					/>
				</div>
			</div>
			<TextBox label="Experience" value={submissionResponse.experience} />
			{submissionResponse.mistakes.length > 0 && (
				<TextBox label="Mistakes" value={submissionResponse.mistakes} />
			)}
			{submissionResponse.resources.length > 0 && (
				<TextBox label="Resources" value={submissionResponse.resources} />
			)}
			{submissionResponse.benefits.length > 0 && (
				<TextBox label="Benefits" value={submissionResponse.benefits} />
			)}
			{submissionResponse.clubPositions.length > 0 && (
				<TextBox
					label="Club Positions"
					value={submissionResponse.clubPositions}
				/>
			)}
		</div>
	);
};
