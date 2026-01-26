import { Ghost, User } from "lucide-react";
import { toast } from "react-toastify";
import ChangeAnonymousToast from "./ChangeAnonymousToast";

interface Props {
	isAnonymous: boolean;
	setIsAnonymous: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnonymousToggle = ({ isAnonymous, setIsAnonymous }: Props) => {
	const openConfirmToast = () => {
		toast(
			<ChangeAnonymousToast
				isAnonymous={isAnonymous}
				onDone={() => setIsAnonymous((prev) => !prev)}
			/>,
			{
				autoClose: false,
				closeOnClick: false,
				closeButton: false,
			},
		);
	};

	return (
		<div className="relative flex items-center gap-1.5 px-1.5 py-[2px] w-fit">
			<span className="text-[10px] sm:text-[12px] font-semibold text-(--text-light)">
				{isAnonymous ? "Anonymous" : "Public"}
			</span>

			<button
				type="button"
				onClick={openConfirmToast}
				className={`relative w-7 h-3.5 sm:w-9 sm:h-5 flex items-center rounded-full p-[1px] transition-colors duration-300 ${
					isAnonymous ? "bg-purple-600" : "bg-blue-500"
				}`}
			>
				<div
					className={`bg-white w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
						isAnonymous ? "translate-x-3.5 sm:translate-x-4" : "translate-x-0"
					}`}
				>
					{isAnonymous ? <Ghost size={10} /> : <User size={10} />}
				</div>
			</button>
		</div>
	);
};

export default AnonymousToggle;
