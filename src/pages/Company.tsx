import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type {
	CompanyPageResponseDto,
	SubmissionCardResponseDto,
} from "../../web-client/src/generated";
import { CompanyControllerApi } from "../../web-client/src/generated/apis";
import SubmissionCard from "../components/SubmissionCard";
import { apiConfig } from "../utils/apiConfig";

function Company() {
	const { company_id } = useParams<{ company_id: string }>();
	const [id, setId] = useState<number | undefined>(undefined);
	const [name, setName] = useState<string>("");
	const [logoUrl, setLogoUrl] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [averageCtc, setAverageCtc] = useState<number>(0);
	const [averageStipend, setAverageStipend] = useState<number>(0);
	const [averageBase, setAverageBase] = useState<number>(0);
	const [favoriteCount, setFavoriteCount] = useState<number>(0);
	const [submission, setSubmission] = useState<SubmissionCardResponseDto[]>([]);

	const mapResponseDtoToStates = useCallback(
		(response: CompanyPageResponseDto) => {
			setId(response.id);
			setName(response.name ?? "");
			setLogoUrl(response.logoUrl ?? "");
			setDescription(response.description ?? "");
			setAverageCtc(response.averageCtc ?? 0);
			setAverageStipend(response.averageStipend ?? 0);
			setAverageBase(response.averageBase ?? 0);
			setFavoriteCount(response.favoriteCount ?? 0);
			setSubmission(response.submission ?? []);
		},
		[],
	);

	const fetchCompanyDetails = useCallback(() => {
		if (company_id === undefined) return;
		const companyControllerApi = new CompanyControllerApi(apiConfig);
		companyControllerApi
			.getCompany({
				companyId: parseInt(company_id),
			})
			.then((response: CompanyPageResponseDto) => {
				mapResponseDtoToStates(response);
			})
			.catch((error) => {
				// add a toast over here that the company cannot be fetched at this point
				console.log(error);
			});
	}, [mapResponseDtoToStates, company_id]);

	useEffect(() => {
		fetchCompanyDetails();
	}, [fetchCompanyDetails]);
	return (
		<div className="h-full w-full flex flex-col items-center gap-[2vmax] pt-[2vmax] overflow-auto">
			<div className="sm:w-[60%] w-[80%] rounded-[1vmax] sm:h-[50vmax] h-[60vmax] bg-(--fore-bg) flex flex-col items-center p-[2vmax] sm:gap-0 gap-[1.8vmax]">
				<div className="w-full h-[50%] flex justify-start items-center p-[0.8vmax]">
					<img
						className="w-[25vmax] h-[12vmax] object-contain"
						src={logoUrl}
						alt=""
					/>
				</div>
				<div
					style={{ fontFamily: "GoldmanSansBd" }}
					className="w-full h-[20%] flex justify-start items-center text-[4vmax] font-semibold text-(--text-heading) p-[0.8vmax]"
				>
					{name}
				</div>
				<div className="w-full h-fit fles justiyf-start items-center p-[0.8vmax] text-(--text-light) text-[1.1vmax]">
					{description} {favoriteCount} Favourite Counts
				</div>
				<div className="w-full h-[10%] flex justify-start items-center p-[0.8vmax]">
					<button
						type="button"
						className="w-[8vmax] h-[3vmax] rounded-[2vmax] bg-(--accent-bg) text-(--accent) text-[1.5vmax]"
					>
						Dream
					</button>
				</div>
				<div className="w-full h-[10%] flex flex-row justify-center items-center p-[0.8vmax] text-[1.1vmax]">
					<div className="w-[30%] h-full flex justify-center items-center flex-col gap-[1vmax]">
						<div className="w-full h-1/2 flex justify-center items-center text-(--text-light)">
							Average CTC
						</div>
						<div className="w-full h-1/2 flex justify-center items-center text-(--text-heading)">
							{averageCtc} LPA
						</div>
					</div>
					<div className="w-[30%] h-full flex justify-center items-center flex-col gap-[1vmax]">
						<div className="w-full h-1/2 flex justify-center items-center text-(--text-light)">
							Average Base
						</div>
						<div className="w-full h-1/2 flex justify-center items-center text-(--text-heading)">
							{averageBase} LPA
						</div>
					</div>
					<div className="w-[30%] h-full flex justify-center items-center flex-col gap-[1vmax]">
						<div className="w-full h-1/2 flex justify-center items-center text-(--text-light)">
							Average Stipend
						</div>
						<div className="w-full h-1/2 flex justify-center items-center text-(--text-heading)">
							{averageStipend} LPM
						</div>
					</div>
				</div>
			</div>
			<div className="w-[80%] h-fit rounded-[1vmax] bg-(--fore-bg) flex flex-wrap p-[2vmax] gap-[4vmax] items-center sm:justify-start justify-center mb-[2vmax]">
				{submission.map((sub) => {
					return (
						<div key={sub.id} className="w-[22vmax] h-[26vmax]">
							<SubmissionCard
								id={sub.id ?? 0}
								companyLogoUrl={sub.companyLogoUrl ?? ""}
								companyName={sub.companyName ?? ""}
								role={sub.role ?? ""}
								tags={sub.tags ?? []}
								type={sub.submissionType ?? ""}
								userName={sub.userName ?? ""}
								year={sub.year ?? 1}
								isFavourite={sub.favourite ?? false}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Company;
