import { useCallback, useEffect, useState } from "react";
import {
	type SubmissionCardResponseDto,
	UserControllerApi,
	type UserProfileResponseDto,
	UserProfileResponseDtoDegreeEnum,
} from "../../web-client/src/generated";
import ProfilePicture from "../components/ProfilePicture";
import SubmissionCard from "../components/SubmissionCard";
import { apiConfig } from "../utils/apiConfig";

function Profile() {
	const [id, setId] = useState<number | undefined>(undefined);
	const [name, setName] = useState<string | undefined>(undefined);
	const [email, setEmail] = useState<string | undefined>(undefined);
	const [department, setDepartment] = useState<string | undefined>(undefined);
	const [year, setYear] = useState<number | undefined>(undefined);
	const [degree, setDegree] = useState<
		UserProfileResponseDtoDegreeEnum | undefined
	>(undefined);
	const [profileUrl, setProfileUrl] = useState<string | undefined>(undefined);
	const [mySubmissions, setMySubmissions] = useState<
		SubmissionCardResponseDto[]
	>([]);

	const mapResponseDtoToStates = useCallback(
		(response: UserProfileResponseDto) => {
			setId(response.id);
			setName(response.name);
			setEmail(response.email);
			setDepartment(response.department);
			setYear(response.year);
			setDegree(response.degree);
			setProfileUrl(response.profileUrl);
			setMySubmissions(response.mySubmissions ?? []);
		},
		[],
	);

	const fetchProfileDetails = useCallback(() => {
		const userControllerApi = new UserControllerApi(apiConfig);

		userControllerApi
			.getUserProfile()
			.then((response: UserProfileResponseDto) => {
				mapResponseDtoToStates(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [mapResponseDtoToStates]);

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
					<div className="font-light text-[#828282] text-[1vmax]">
						Dream Company
					</div>
					<img
						className="w-[5vmax] h-[3vmax] pr-[1.7vmax]"
						src="https://i.pinimg.com/originals/01/ca/da/01cada77a0a7d326d85b7969fe26a728.jpg"
						alt=""
					/>
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
