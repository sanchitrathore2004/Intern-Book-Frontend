import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	type SubmissionCardResponseDto,
	UserControllerApi,
	type UserProfileResponseDto,
	type UserProfileResponseDtoDegreeEnum,
} from "../../web-client/src/generated";
import ProfilePicture from "../components/ProfilePicture";
import SubmissionCard from "../components/SubmissionCard";
import { apiConfig } from "../utils/apiConfig";
import { DepartmentConfig } from "../utils/departmentConfig";
import { YearConfig } from "../utils/yearConfig";

function Profile() {
	const navigate = useNavigate();
	const [id, setId] = useState<number | undefined>(undefined);
	const [name, setName] = useState<string | undefined>(undefined);
	const [email, setEmail] = useState<string | undefined>(undefined);
	const [department, setDepartment] = useState<string | undefined>(undefined);
	const [year, setYear] = useState<string | undefined>(undefined);
	const [degree, setDegree] = useState<
		UserProfileResponseDtoDegreeEnum | undefined
	>(undefined);
	const [profileUrl, setProfileUrl] = useState<string | undefined>(undefined);
	const [mySubmissions, setMySubmissions] = useState<
		SubmissionCardResponseDto[]
	>([]);
	const [favouriteCompanyLogoUrl, setFavouriteCompanyLogoUrl] = useState<
		string | undefined
	>(undefined);
	const [favouriteCompanyId, setFavouriteCompanyId] = useState<
		number | undefined
	>(undefined);

	const getDepartment = useCallback(
		(dept: string | undefined): string | undefined => {
			if (dept === undefined) return "NA";
			const departmentConfig = new DepartmentConfig();
			return departmentConfig.getDepartment(dept);
		},
		[],
	);

	const getYear = useCallback((yr: string | undefined): string | undefined => {
		if (yr === undefined) return "NA";
		const yearConfig = new YearConfig();
		return yearConfig.getYear(yr);
	}, []);

	const mapResponseDtoToStates = useCallback(
		(response: UserProfileResponseDto) => {
			setId(response.id);
			setName(response.name);
			setEmail(response.email);
			setDepartment(getDepartment(response.department));
			setYear(getYear(String(response.year)));
			setDegree(response.degree);
			setProfileUrl(response.profileUrl);
			setMySubmissions(response.mySubmissions ?? []);
			setFavouriteCompanyLogoUrl(response.favouriteCompany?.logoUrl);
			setFavouriteCompanyId(response.favouriteCompany?.id);
		},
		[getYear, getDepartment],
	);

	const fetchProfileDetails = useCallback(() => {
		const userControllerApi = new UserControllerApi(apiConfig);

		userControllerApi
			.getUserProfile()
			.then((response: UserProfileResponseDto) => {
				console.log(response);
				mapResponseDtoToStates(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [mapResponseDtoToStates]);

	const handleDreamCompanyClick = () => {
		navigate(`/company/${favouriteCompanyId}`);
	};

	useEffect(() => {
		fetchProfileDetails();
	}, [fetchProfileDetails]);
	return (
		<div className="h-full w-full flex flex-col items-center gap-[2vmax] pt-[2vmax] overflow-auto">
			<div className="sm:w-[60%] w-[80%] rounded-[1vmax] sm:h-[20vmax] h-[35vmax] bg-(--fore-bg) flex sm:flex-row flex-col items-center p-[2vmax] sm:gap-0 gap-[1.8vmax]">
				<div className="sm:h-[10vmax] sm:w-[20%] w-full h-[40%] rounded-[1.5vmax] flex justify-start items-start">
					<div className="h-full w-[30%] sm:w-full object-center object-cover rounded-[1.5vmax]">
						<ProfilePicture profileUrl={profileUrl ?? ""} />
					</div>
				</div>
				<div className="sm:w-[80%] w-full h-[10vmax] flex flex-col justify-center items-center text-(--text-light) sm:gap-0 gap-[0.5vmax]">
					<div
						style={{ fontFamily: "GoldmanSansBd" }}
						className="w-full h-fit flex items-end sm:text-[2vmax] text-[2.8vmax] sm:pt-0 pt-[8vmax] pl-[2vmax] text-(--text-heading)"
					>
						{name}
					</div>
					<div className="w-full h-fit pl-[2vmax] sm:text-[1.1vmax] text-[1.5vmax]">
						{department}
					</div>
					<div className="w-full h-[15%] pl-[2vmax] sm:text-[1.1vmax] text-[1.5vmax]">
						{email}
					</div>
					<div className="w-full h-[15%] pl-[2vmax] sm:text-[1.1vmax] text-[1.5vmax]">
						{degree}
					</div>
					<div className="w-full h-[15%] pl-[2vmax] sm:text-[1.1vmax] text-[1.5vmax]">
						{year}
					</div>
				</div>
				<div className="sm:w-[20%] w-full h-full flex flex-col items-end justify-end gap-[0.7vmax]">
					<div className="font-light text-[#828282] pr-[0.4vmax] text-[1vmax]">
						Dream Company
					</div>
					<button
						type="button"
						onClick={handleDreamCompanyClick}
						className="cursor-pointer bg-transparent border-none p-0"
					>
						<img
							className="w-[7vmax] h-[3vmax] pr-[1vmax] object-contain"
							src={favouriteCompanyLogoUrl}
							alt="Dream Company"
						/>
					</button>
				</div>
			</div>
			<div className="w-[80%] h-fit rounded-[1vmax] bg-(--fore-bg) flex flex-wrap p-[2vmax] gap-[4vmax] items-center sm:justify-start justify-center mb-[2vmax]">
				{mySubmissions.map((sub) => {
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

export default Profile;
