import { Pencil, Trash2, Upload } from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import AnonymousToggle from "../components/AnonymousToggle";
import Loader from "../components/Loader";
import ProfilePicture from "../components/ProfilePicture";
import SubmissionCard from "../components/SubmissionCard";
import UserContext from "../contexts/UserContext";
import useDeleteProfilePicture from "../hooks/useDeleteProfilePicture";
import useDeleteSubmission from "../hooks/useDeleteSubmission";
import useGetCloudinaryCredentials from "../hooks/useGetCloudinaryCredentials";
import useGetProfile from "../hooks/useGetProfile";
import useGetToggleUser from "../hooks/useGetToggleUser";
import useUpdateProfilePicture from "../hooks/useUpdateProfilePicture";
import UploadModal from "../modals/UploadModal";
import { DepartmentConfig } from "../utils/departmentConfig";
import { resizeImageToMax256 } from "../utils/imageResize";
import { navigateWithModifiers } from "../utils/navigateWithModifiers";
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
	const deleteControllerRef = useRef<AbortController | null>(null);
	const uploadInProgressRef = useRef<boolean>(false);
	const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const toastIdRef = useRef<string | number | null>(null);
	const navigate = useNavigate();
	const location = useLocation();
	const isOwnProfile = String(user.id) === String(user_id);
	const [openActions, setOpenActions] = useState(false);
	const { deleteProfilePicture } = useDeleteProfilePicture();
	const deleteToastId = useRef<string | number | null>(null);

	// delete a submission
	const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
	const confirmRef = useRef<HTMLDivElement | null>(null);
	const actionsRef = useRef<HTMLDivElement | null>(null);
	const { deleteSubmission, loading: deleteLoading } = useDeleteSubmission();

	const handleDeleteSubmission = async (submissionId: number) => {
		const controller = new AbortController();
		const success = await deleteSubmission(submissionId, controller);

		if (success) {
			showSuccess("Submission deleted");
			fetchProfileDetails(Number(user_id), new AbortController());
		} else {
			showError("Failed to delete submission");
		}
		setDeleteConfirmId(null);
	};

	useEffect(() => {
		if (deleteConfirmId === null) return;
		const handleClickOutside = (e: MouseEvent) => {
			if (
				confirmRef.current &&
				!confirmRef.current.contains(e.target as Node)
			) {
				setDeleteConfirmId(null);
			}
		};
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") setDeleteConfirmId(null);
		};
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEsc);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEsc);
		};
	}, [deleteConfirmId]);

	useEffect(() => {
		if (!openActions) return;
		const handleClickOutside = (e: MouseEvent) => {
			if (
				actionsRef.current &&
				!actionsRef.current.contains(e.target as Node)
			) {
				setOpenActions(false);
			}
		};
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpenActions(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEsc);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEsc);
		};
	}, [openActions]);

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

	const handleEditClick = (
		e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		anonymmous: boolean | undefined,
		id?: number,
	) => {
		if (anonymmous) {
			toast.warning(
				"Editing is disabled while your profile is private. Switch to public to continue.",
			);
		} else {
			navigateWithModifiers(e, navigate, `/submissionForm/${id}`);
		}
	};

	const sendUploadSecureUrlToBackend = useCallback(
		async (secureUrl: string) => {
			const controller = new AbortController();
			try {
				const success = await updateUserProfilePicture(secureUrl, controller);
				if (toastIdRef.current) {
					if (success) {
						dispatch({
							type: "UPDATE_PROFILE",
							payload: { profileUrl: secureUrl },
						});
						toast.update(toastIdRef.current, {
							render: "Profile updated!",
							type: "success",
							isLoading: false,
							autoClose: 3000,
						});
					} else {
						toast.update(toastIdRef.current, {
							render:
								"Profile updated successfully, it will take a while to reflect on the complete site",
							type: "error",
							isLoading: false,
							autoClose: 3000,
						});
					}
				}
			} catch (error) {
				console.error(error);
				if (toastIdRef.current)
					toast.update(toastIdRef.current, {
						render: "Upload failed",
						type: "error",
						isLoading: false,
						autoClose: 1000,
					});
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
		setPendingUploadFile(null);
		if (!cloudinaryUploadResponse.ok) {
			const error = await cloudinaryUploadResponse.json();
			throw new Error(error?.error?.message || "Upload failed");
		}
		const formattedCloudinaryUploadResposne =
			await cloudinaryUploadResponse.json();
		sendUploadSecureUrlToBackend(formattedCloudinaryUploadResposne.secure_url);
	}, [cloudinaryCredentials, sendUploadSecureUrlToBackend, pendingUploadFile]);

	const handleProfileUpload = async (file: File) => {
		uploadControllerRef.current?.abort();
		const controller = new AbortController();
		uploadControllerRef.current = controller;
		const resizedFile = await resizeImageToMax256(file);
		setPendingUploadFile(resizedFile);

		toastIdRef.current = toast.loading(
			"Updating profile picture, this may take a while..",
		);
		fetchCloudinaryCredentials(controller);
	};

	const handleDeleteProfile = async () => {
		if (user.profileUrl?.startsWith("https://robohash.org/")) {
			toast.error("Profile does not exist.");
			return;
		}
		deleteControllerRef.current?.abort();
		const controller = new AbortController();
		deleteControllerRef.current = controller;
		deleteToastId.current = toast.loading("Deleting profile picture.");
		const profileUrl = await deleteProfilePicture(controller);
		toast.update(deleteToastId.current, {
			render: "Profile deleted successfully.",
			type: "success",
			isLoading: false,
			autoClose: 3000,
		});
		dispatch({
			type: "UPDATE_PROFILE",
			payload: { profileUrl: profileUrl ?? "" },
		});
	};

	useEffect(() => {
		if (!cloudinaryCredentials || !pendingUploadFile) {
			uploadInProgressRef.current = false;
			return;
		}
		if (uploadInProgressRef.current) return;
		uploadInProgressRef.current = true;
		uploadProfilePhoto();
	}, [cloudinaryCredentials, pendingUploadFile, uploadProfilePhoto]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <we need to refetch the cards when user.anonymous is changed>
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
	}, [user_id, user.anonymous, fetchProfileDetails, navigate]);

	const { getToggleResponse } = useGetToggleUser();

	useEffect(() => {
		if (!isOwnProfile) return;
		getToggleResponse();
	}, [isOwnProfile, getToggleResponse]);

	if (error) showError(error.message);
	if (!profile) return <Loader fullscreen />;

	return (
		<div className="h-full w-full flex flex-col items-center gap-[2vmax] pt-[2vmax] overflow-auto">
			{isModalOpen && String(user.id) === String(user_id) && (
				<UploadModal
					setIsModalOpen={setIsModalOpen}
					callFunc={handleProfileUpload}
				/>
			)}
			<ToastContainer newestOnTop />
			{loading && <Loader fullscreen />}
			<div className="sm:w-[60%] w-[80%] rounded-[1vmax] sm:h-[20vmax] h-[35vmax] bg-(--fore-bg) flex sm:flex-row flex-col items-center p-[2vmax] sm:gap-0 gap-[1.8vmax]">
				<div className="sm:h-[10vmax] sm:w-[20%] w-full h-[40%] rounded-[1.5vmax] flex justify-start items-start">
					<div className="group relative h-full w-[30%] sm:w-full rounded-[1.5vmax] overflow-visible">
						<div className="relative rounded-[1.5vmax] overflow-hidden cursor-pointer">
							<ProfilePicture
								profileUrl={
									String(user.id) === String(user_id)
										? (user.profileUrl ?? "")
										: (profile.profileUrl ?? "")
								}
							/>
							{isOwnProfile && (
								<div
									role="none"
									onMouseDown={() => setOpenActions(true)}
									className="absolute inset-0 flex items-center justify-center 
                     bg-black/40 opacity-0 group-hover:opacity-100 
                     transition duration-200"
								>
									<span className="text-white text-sm font-medium">
										Change photo
									</span>
								</div>
							)}
						</div>
						{openActions && (
							<div
								ref={actionsRef}
								className="absolute -top-7 left-28 sm:left-38 mt-8 w-36 bg-(--fore-bg) border border-red-500/40 rounded-xl p-3 shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200 z-30"
							>
								<div className="flex flex-col gap-2">
									<button
										type="button"
										onClick={() => {
											setIsModalOpen(true);
											setOpenActions(false);
										}}
										className="flex-1 hover:bg-(--accent-hover) text-(--text-heading) font-bold text-[11px] py-1.5 rounded-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
									>
										Upload
									</button>
									<button
										type="button"
										onClick={() => {
											handleDeleteProfile();
											setOpenActions(false);
										}}
										className="flex-1 hover:bg-red-500/20 text-(--text-heading) text-[11px] font-bold py-1.5 rounded-lg transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
									>
										{deleteLoading ? "..." : "Delete"}
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="sm:w-[80%] w-full h-[10vmax] flex flex-col justify-center items-center text-(--text-light) sm:gap-0 gap-[0.5vmax]">
					<div
						style={{ fontFamily: "Galdeano" }}
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
				<div className="sm:w-[20%] w-full h-full flex flex-col items-end justify-between gap-[0.7vmax]">
					{isOwnProfile && (
						<AnonymousToggle isAnonymous={user.anonymous ?? false} />
					)}
					{profile.favouriteCompany?.id ? (
						<>
							<div className="font-light text-(--text-light) pr-[0.4vmax] text-[1vmax]">
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
									alt={profile.favouriteCompany.name}
								/>
							</button>
						</>
					) : (
						<div className="text-(--text-light) sm:text-[0.9vmax] text-[1.5vmax]">
							Dream Company: TBD
						</div>
					)}
				</div>
			</div>
			<div className="w-[80%] h-fit rounded-[1vmax] bg-(--fore-bg) flex flex-wrap p-[2vmax] gap-[4vmax] items-center sm:justify-start justify-center mb-[2vmax]">
				{profile.mySubmissions?.map((sub) => {
					return (
						<div
							key={sub.id}
							className="sm:w-[22vmax] sm:h-[29vmax] w-[85%] h-[40vmax] relative"
						>
							{isOwnProfile && (
								<div className="absolute top-2 left-2 z-20 flex flex-col items-start gap-2">
									<button
										type="button"
										onClick={() => setDeleteConfirmId(sub.id ?? 1)}
										className="p-1.5 bg-black/30 hover:bg-red-600 text-white/90 rounded-full transition-all duration-200 backdrop-blur-md shadow-md group cursor-pointer"
										title="Delete Submission"
									>
										<Trash2 size={14} className="group-hover:scale-110" />
									</button>

									<button
										type="button"
										onClick={(e) => {
											handleEditClick(e, sub.anonymous ?? false, sub.id);
										}}
										className="p-1.5 bg-black/30 hover:bg-red-600 text-white/90 rounded-full transition-all duration-200 backdrop-blur-md shadow-md group cursor-pointer"
										title="Edit Submission"
									>
										<Pencil size={14} className="group-hover:scale-110" />
									</button>

									{deleteConfirmId === sub.id && (
										<div
											ref={confirmRef}
											className="absolute top-0 left-0 mt-8 w-36 bg-(--fore-bg) border border-red-500/40 rounded-xl p-3 shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200 z-30"
										>
											<p className="text-[12px] text-left mb-3 font-medium text-(--text-heading)">
												Delete this submission?
											</p>
											<div className="flex gap-2">
												<button
													type="button"
													disabled={deleteLoading}
													onClick={() => handleDeleteSubmission(sub.id ?? 1)}
													className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold py-1.5 rounded-lg transition-colors shadow-sm cursor-pointer transision-all active:scale-95"
												>
													{deleteLoading ? "..." : "Delete"}
												</button>
												<button
													type="button"
													onClick={() => setDeleteConfirmId(null)}
													className="flex-1 bg-white/10 hover:bg-white/20 text-(--text-light) text-[11px] py-1.5 rounded-lg transition-colors cursor-pointer transision-all active:scale-95"
												>
													Cancel
												</button>
											</div>
										</div>
									)}
								</div>
							)}
							<SubmissionCard
								id={sub.id ?? 0}
								companyId={sub.companyId ?? 0}
								companyLogoUrl={sub.companyLogoUrl ?? "logo"}
								companyName={sub.companyName ?? ""}
								domainName={sub.domainName ?? ""}
								tags={sub.tags ?? []}
								type={sub.submissionType ?? ""}
								userName={sub.userName ?? ""}
								year={sub.year ?? 1}
								isFavourite={sub.favourite ?? false}
								likeCount={sub.likeCount ?? 0}
								isAnonymous={sub.anonymous}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Profile;
