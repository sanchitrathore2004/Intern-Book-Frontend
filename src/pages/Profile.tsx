import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "../components/Loader";
import ProfilePicture from "../components/ProfilePicture";
import SubmissionCard from "../components/SubmissionCard";
import UserContext from "../contexts/UserContext";
import useGetCloudinaryCredentials from "../hooks/useGetCloudinaryCredentials";
import useGetProfile from "../hooks/useGetProfile";
import useUpdateProfilePicture from "../hooks/useUpdateProfilePicture";
import { DepartmentConfig } from "../utils/departmentConfig";
import { showError, showSuccess } from "../utils/toast";
import { YearConfig } from "../utils/yearConfig";

function Profile() {
	const { user_id } = useParams<{ user_id: string }>();
	const { profile, loading, error, fetchProfileDetails } = useGetProfile();
	const { cloudinaryCredentials, fetchCloudinaryCredentials } =
		useGetCloudinaryCredentials();
	const { updateUserProfilePicture } = useUpdateProfilePicture();
	const { dispatch, user } = useContext(UserContext);
	const uploadControllerRef = useRef<AbortController | null>(null);
	const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (location.state?.submissionSaved) {
			showSuccess("Submission saved successfully!");
			navigate(location.pathname, { replace: true, state: {} });
		}
	}, [location, navigate]);

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

	const handleDreamCompanyClick = () => {
		navigate(`/company/${profile?.favouriteCompany?.id}`);
	};

	const sendUploadSecureUrlToBackend = useCallback(
		async (secureUrl: string) => {
			const controller = new AbortController();
			try {
				const success = await updateUserProfilePicture(secureUrl, controller);
				if (success) {
					dispatch({
						type: "UPDATE_PROFILE",
						payload: { profileUrl: secureUrl },
					});
					// add toast
				} else {
					// add toast
				}
			} catch (error) {
				// add toast
			}
		},
		[updateUserProfilePicture, dispatch],
	);

	const uploadProfilePhoto = useCallback(async () => {
		if (
			!cloudinaryCredentials ||
			!cloudinaryCredentials.apiKey ||
			!cloudinaryCredentials.timeStamp ||
			!cloudinaryCredentials.signature ||
			!cloudinaryCredentials.folder ||
			!cloudinaryCredentials.cloudName
		) {
			// add toast
			return;
		}
		if (!pendingUploadFile) return;
		const formData = new FormData();
		formData.append("file", pendingUploadFile);
		formData.append("api_key", cloudinaryCredentials.apiKey);
		formData.append("timestamp", cloudinaryCredentials.timeStamp.toString());
		formData.append("signature", cloudinaryCredentials.signature);
		formData.append("folder", cloudinaryCredentials.folder);
		const cloudinaryUploadResponse = await fetch(
			`https://api.cloudinary.com/v1_1/${cloudinaryCredentials.cloudName}/image/upload`,
			{
				method: "POST",
				body: formData,
			},
		);
		if (!cloudinaryUploadResponse.ok) {
			const error = await cloudinaryUploadResponse.json();
			throw new Error(error?.error?.message || "Upload failed");
		}
		const formattedCloudinaryUploadResposne =
			await cloudinaryUploadResponse.json();
		sendUploadSecureUrlToBackend(formattedCloudinaryUploadResposne.secure_url);
	}, [cloudinaryCredentials, sendUploadSecureUrlToBackend, pendingUploadFile]);

	const handleProfileUpload = (file: File) => {
		uploadControllerRef.current?.abort();
		const controller = new AbortController();
		uploadControllerRef.current = controller;
		setPendingUploadFile(file);
		fetchCloudinaryCredentials(controller);
	};

	useEffect(() => {
		if (!cloudinaryCredentials || !pendingUploadFile) return;
		uploadProfilePhoto();
	}, [cloudinaryCredentials, pendingUploadFile, uploadProfilePhoto]);

	useEffect(() => {
		if (!user_id) {
			navigate("/error");
			return;
		}

		const submissionIdNum = Number(user_id);
		if (Number.isNaN(submissionIdNum)) {
			navigate("/error");
			return;
		}

		const controller = new AbortController();
		fetchProfileDetails(submissionIdNum, controller);
		return () => controller.abort();
	}, [user_id, fetchProfileDetails, navigate]);

	if (error) showError(error.message);
	if (!profile) return <Loader fullscreen />;

	return (
		<div className="h-full w-full flex flex-col items-center gap-[2vmax] pt-[2vmax] overflow-auto">
			<ToastContainer newestOnTop />
			{loading && <Loader fullscreen />}
			<div className="sm:w-[60%] w-[80%] rounded-[1vmax] sm:h-[20vmax] h-[35vmax] bg-(--fore-bg) flex sm:flex-row flex-col items-center p-[2vmax] sm:gap-0 gap-[1.8vmax]">
				<div className="sm:h-[10vmax] sm:w-[20%] w-full h-[40%] rounded-[1.5vmax] flex justify-start items-start">
					<div className="relative h-full w-[30%] sm:w-full object-center object-cover rounded-[1.5vmax]">
						<input
							type="file"
							accept="image/*"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (!file) return;
								handleProfileUpload(file);
							}}
							placeholder="upload"
							className="absolute top-0 left-0"
						/>
						<ProfilePicture profileUrl={user.profileUrl ?? ""} />
					</div>
				</div>
				<div className="sm:w-[80%] w-full h-[10vmax] flex flex-col justify-center items-center text-(--text-light) sm:gap-0 gap-[0.5vmax]">
					<div
						style={{ fontFamily: "GoldmanSansBd" }}
						className="w-full h-fit flex items-end sm:text-[2vmax] text-[2.8vmax] sm:pt-0 pt-[8vmax] pl-[2vmax] text-(--text-heading)"
					>
						{profile.name}
					</div>
					<div className="w-full h-fit pl-[2vmax] sm:text-[1.1vmax] text-[1.5vmax]">
						{getDepartment(profile.department)}
					</div>
					<div className="w-full h-[15%] pl-[2vmax] sm:text-[1.1vmax] text-[1.5vmax]">
						{profile.email}
					</div>
					<div className="w-full h-[15%] pl-[2vmax] sm:text-[1.1vmax] text-[1.5vmax]">
						{profile.degree}
					</div>
					<div className="w-full h-[15%] pl-[2vmax] sm:text-[1.1vmax] text-[1.5vmax]">
						{getYear(profile.year?.toString())}
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
							src={profile.favouriteCompany?.logoUrl}
							alt="Dream Company"
						/>
					</button>
				</div>
			</div>
			<div className="w-[80%] h-fit rounded-[1vmax] bg-(--fore-bg) flex flex-wrap p-[2vmax] gap-[4vmax] items-center sm:justify-start justify-center mb-[2vmax]">
				{profile.mySubmissions?.map((sub) => {
					return (
						<div key={sub.id} className="w-[22vmax] h-[26vmax]">
							<SubmissionCard
								id={sub.id ?? 0}
								companyLogoUrl={sub.companyLogoUrl ?? "logo"}
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
