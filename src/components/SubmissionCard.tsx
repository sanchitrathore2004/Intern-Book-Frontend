import { Bookmark } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	type AddToFavouritesRequest,
	type ToggleResponseDto,
	UserControllerApi,
} from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";
import Tags from "./Tags";

interface SubmissionCardProps {
	id: number;
	companyName: string;
	userName: string;
	type: string;
	role: string;
	year: number;
	tags: string[];
	companyLogoUrl: string;
	isFavourite: boolean;
}

function SubmissionCard(props: SubmissionCardProps) {
	const [isFavourite, setIsFavourite] = useState(props.isFavourite);
	const navigate = useNavigate();

	const handleToggle = useCallback(async () => {
		try {
			const request: AddToFavouritesRequest = { submissionId: props.id };
			const userApi = new UserControllerApi(apiConfig);

			const res: ToggleResponseDto = await userApi.toggleFavourites(request);
			if (res === null || res.favourite === undefined)
				throw new Error("Some error occured while toggling submission");

			setIsFavourite(res.favourite);
		} catch (er) {
			console.error(er);
		}
	}, [props]);

	const handleShowDetials = () => {
		navigate(`/submission/${props.id}`);
	};

	return (
		<div className="w-full h-full flex flex-col justify-between items-center p-1 rounded-[0.6vmax] bg-(--bg) transition-all duration-200 hover:shadow-[0_0_8px_var(--shadow-color)]">
			<div className="w-full max-h-[40%] flex justify-center items-center">
				<img
					className="h-full w-full rounded-tl-[0.6vmax] rounded-tr-[0.6vmax] p-[0.1vmax] object-contain"
					src={props.companyLogoUrl}
					alt=""
				/>
			</div>
			<div className=" w-full max-h-[30%] flex flex-col justify-center items-center">
				<div
					style={{ fontFamily: "GoldmanSansBd" }}
					className="w-full h-fit flex items-center text-[2vmax] font-bold text-(--text-heading) pl-[0.5vmax]"
				>
					{props.companyName}
				</div>
				<div className="w-full max-h-[40%] flex items-start text-(--text-light) font-light text-[1.2vmax] pl-[0.5vmax]">
					{props.userName.split(" ")[0]} . {props.type} . {props.role} .{" "}
					{props.year}
				</div>
			</div>
			<div className="w-full h-[18%] flex flex-wrap gap-[0.5vmax] pl-[0.5vmax]">
				{props.tags.map((tag, index) => {
					if(index>4) return ;
					return (
						<div key={tag} className="h-fit">
							<Tags tagName={tag} />
						</div>
					);
				})}
			</div>
			<div className="w-full h-[12%] justify-center flex items-end pl-[0.5vmax] pb-[0.3vmax]">
				<button
					type="button"
					onClick={handleShowDetials}
					className="h-[80%] w-[80%] flex justify-center items-center bg-(--accent) rounded-md font-bold cursor-pointer text-[1.4vmax] text-(--bg)"
				>
					Show Details
				</button>
				<button
					type="button"
					onClick={handleToggle}
					className="h-[90%] w-[20%] flex justify-center items-center cursor-pointer"
				>
					{isFavourite ? (
						<Bookmark
							className="text-(--accent) w-4 lg:w-8"
							fill="var(--accent)"
						/>
					) : (
						<Bookmark className="text-(--accent) w-4 lg:w-8" />
					)}
				</button>
			</div>
		</div>
	);
}

export default SubmissionCard;
