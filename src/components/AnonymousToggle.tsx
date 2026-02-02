import { Ghost, User } from "lucide-react";
import { useContext } from "react";
import { toast } from "react-toastify";
import { UserControllerApi } from "../../web-client/src/generated";
import UserContext from "../contexts/UserContext";
import { apiConfig } from "../utils/apiConfig";
import ChangeAnonymousToast from "./ChangeAnonymousToast";

interface Props {
	isAnonymous: boolean;
}

const AnonymousToggle = ({ isAnonymous }: Props) => {
	const { dispatch } = useContext(UserContext);

	const toggleAnonymous = async () => {
		try {
			const api = new UserControllerApi(apiConfig);
			await api.getAnonymousProfile();
			dispatch({
				type: "UPDATE_PROFILE",
				payload: { anonymous: !isAnonymous },
			});
		} catch (err) {
			console.error(err);
			toast.error("Failed to update anonymous mode");
		}
	};

	const openConfirmToast = () => {
		toast(
			<ChangeAnonymousToast
				isAnonymous={isAnonymous}
				onDone={toggleAnonymous}
			/>,
			{
				autoClose: false,
				closeOnClick: false,
				closeButton: false,
			},
		);
	};

	return (
		<div className="relative flex items-center gap-1.5 px-1.5 py-0.5 w-fit">
			<span className="text-[10px] sm:text-[12px] font-semibold text-(--text-light)">
				{isAnonymous ? "Anonymous" : "Public"}
			</span>

			<button
				type="button"
				onClick={openConfirmToast}
				className={`relative w-7 h-3.5 sm:w-9 sm:h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
					isAnonymous ? "bg-(--bg)" : "bg-(--accent)"
				}`}
			>
				<div
					className={`bg-(--fore-bg) w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
						isAnonymous ? "translate-x-3.5 sm:translate-x-4" : "translate-x-0"
					}`}
				>
					{isAnonymous ? (
						<Ghost size={10} className="text-(--text-heading)" />
					) : (
						<User size={10} className="text-(--text-heading)" />
					)}
				</div>
			</button>
		</div>
	);
};

export default AnonymousToggle;
