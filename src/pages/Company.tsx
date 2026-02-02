import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
	type ChangeDreamCompanyRequest,
	type ChangeDreamCompanyResponseDto,
	CompanyControllerApi,
	type CompanyPageResponseDto,
} from "../../web-client/src/generated";
import ConfirmChangeToast from "../components/ConfirmChangeToast";
import Loader from "../components/Loader";
import SubmissionCard from "../components/SubmissionCard";
import { useTheme } from "../contexts/ThemeContext";
import useGetCompany from "../hooks/useGetCompany";
import { apiConfig } from "../utils/apiConfig";
import { showError, showInfo, showSuccess } from "../utils/toast";

function Company() {
	const { company_id } = useParams<{ company_id: string }>();
	const navigate = useNavigate();
	const { theme } = useTheme();
	const companyId = Number(company_id);
	const queryClient = useQueryClient();

	const { data: company, isLoading: loading, error } = useGetCompany(companyId);

	const [imgSrc, setImgSrc] = useState<string>(
		company?.logoUrl ??
			(theme === "light"
				? "/assets/images/app_icon_dark.png"
				: "/assets/images/app_icon_light.png"),
	);

	useEffect(() => {
		setImgSrc(
			company?.logoUrl ??
				(theme === "light"
					? "/assets/images/app_icon_dark.png"
					: "/assets/images/app_icon_light.png"),
		);
	}, [company?.logoUrl, theme]);

	useEffect(() => {
		if (
			imgSrc === "/assets/images/app_icon_dark.png" ||
			imgSrc === "/assets/images/app_icon_light.png"
		) {
			setImgSrc(
				theme === "light"
					? "/assets/images/app_icon_dark.png"
					: "/assets/images/app_icon_light.png",
			);
		}
	}, [imgSrc, theme]);

	const handleDreamCompanyClick = useCallback(
		async (companyId: number) => {
			try {
				const companyController = new CompanyControllerApi(apiConfig);
				const request: ChangeDreamCompanyRequest = { companyId };

				const res: ChangeDreamCompanyResponseDto =
					await companyController.changeDreamCompany(request);
				if (!res) throw new Error("Some error occured");

				if (res.removed) {
					showInfo(`${company?.name} is removed from dream company`, 2500);
					queryClient.setQueryData(
						["company", companyId],
						(prev: CompanyPageResponseDto | undefined) =>
							prev
								? { ...prev, favoriteCount: (prev.favoriteCount ?? 0) - 1 }
								: prev,
					);
				} else if (res.conflict) {
					toast.info(
						<ConfirmChangeToast
							companyId={companyId}
							currentCompanyName={res.currentCompanyName ?? ""}
							newCompanyName={company?.name}
							onDone={() => {
								queryClient.setQueryData(
									["company", companyId],
									(prev: CompanyPageResponseDto | undefined) =>
										prev
											? {
													...prev,
													favoriteCount: (prev.favoriteCount ?? 0) + 1,
												}
											: prev,
								);
							}}
						/>,
						{ autoClose: false },
					);
				} else {
					showSuccess(`Dream company set to ${res.currentCompanyName}`, 2500);
					queryClient.setQueryData(
						["company", companyId],
						(prev: CompanyPageResponseDto | undefined) =>
							prev
								? { ...prev, favoriteCount: (prev.favoriteCount ?? 0) + 1 }
								: prev,
					);
				}
			} catch (error) {
				console.log(error);
				if (error instanceof Error) showError(error.message);
			}
		},
		[company?.name, queryClient.setQueryData],
	);

	useEffect(() => {
		if (!company_id || Number.isNaN(companyId)) {
			navigate("/error");
		}
	}, [company_id, companyId, navigate]);

	useEffect(() => {
		if (error) showError(error.message);
	}, [error]);

	if (!company) return <Loader fullscreen />;

	// comment to make file the modified

	return (
		<div className="h-full w-full flex flex-col items-center gap-[2vmax] pt-[2vmax] overflow-auto">
			{loading && <Loader fullscreen />}
			<ToastContainer newestOnTop />
			<div className="sm:w-[60%] w-[80%] rounded-[1vmax] sm:h-[50vmax] h-[60vmax] bg-(--fore-bg) flex flex-col items-center p-[2vmax] sm:gap-0 gap-[1.8vmax]">
				<div className="w-full h-[50%] flex justify-start items-center p-[0.8vmax]">
					<img
						fetchPriority="high"
						className="w-[25vmax] h-[12vmax] object-contain"
						src={imgSrc}
						alt={`${company.name} logo`}
						onError={() => {
							setImgSrc(
								theme === "light"
									? "/assets/images/app_icon_dark.png"
									: "/assets/images/app_icon_light.png",
							);
						}}
					/>
				</div>
				<div
					style={{ fontFamily: "GoldmanSansBd" }}
					className="w-full h-[20%] flex justify-start items-center text-[4vmax] font-semibold text-(--text-heading) p-[0.8vmax]"
				>
					{company.name}
				</div>
				<div className="w-full h-fit fles justiyf-start items-center p-[0.8vmax] text-(--text-light) text-[1.1vmax]">
					<div>{company.description}</div>
					<div className="text-lg font-bold text-(--accent)">
						{company.favoriteCount} followers
					</div>
				</div>

				<div className="w-full h-[10%] flex justify-start items-center p-[0.8vmax]">
					<button
						type="button"
						onClick={() => handleDreamCompanyClick(company.id ?? 1)}
						className="w-[8vmax] h-[3vmax] rounded-[2vmax] bg-(--accent-bg) text-(--accent) text-[1.5vmax] font-bold transition-all active:scale-95 cursor-pointer hover:bg-(--accent-bg-hover)"
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
							{company.averageCtc} LPA
						</div>
					</div>
					<div className="w-[30%] h-full flex justify-center items-center flex-col gap-[1vmax]">
						<div className="w-full h-1/2 flex justify-center items-center text-(--text-light)">
							Average Base
						</div>
						<div className="w-full h-1/2 flex justify-center items-center text-(--text-heading)">
							{company.averageBase} LPA
						</div>
					</div>
					<div className="w-[30%] h-full flex justify-center items-center flex-col gap-[1vmax]">
						<div className="w-full h-1/2 flex justify-center items-center text-(--text-light)">
							Average Stipend
						</div>
						<div className="w-full h-1/2 flex justify-center items-center text-(--text-heading)">
							{company.averageStipend} LPM
						</div>
					</div>
				</div>
			</div>
			<div className="w-[80%] h-fit rounded-[1vmax] bg-(--fore-bg) flex flex-wrap p-[2vmax] gap-[4vmax] items-center sm:justify-start justify-center mb-[2vmax]">
				{company.submission?.map((sub) => {
					return (
						<div key={sub.id} className="w-[22vmax] h-[26vmax]">
							<SubmissionCard
								id={sub.id ?? 0}
								companyId={sub.companyId ?? 0}
								companyLogoUrl={sub.companyLogoUrl ?? sub.companyName ?? "alt"}
								companyName={sub.companyName ?? ""}
								domainName={sub.domainName ?? ""}
								tags={sub.tags ?? []}
								type={sub.submissionType ?? ""}
								userName={sub.userName ?? ""}
								year={sub.year ?? 1}
								isFavourite={sub.favourite ?? false}
								isAnonymous={sub.anonymous}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Company;
