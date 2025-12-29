import { Bookmark } from "lucide-react";
import Tags from "./Tags";

interface SubmissionCardProps {
	companyName: string;
	userName: string;
	type: string;
	role: string;
	year: string;
	tags: string[];
	companyLogoUrl: string;
}

function SubmissionCard(props: SubmissionCardProps) {
	return (
		<div className="w-full h-full flex flex-col justify-center items-center rounded-[0.6vmax] bg-[#242424]">
			<div className="w-full h-[40%] flex justify-center items-center">
				<img
					className="h-full w-full rounded-tl-[0.6vmax] rounded-tr-[0.6vmax] p-[0.1vmax] object-fill"
					src={props.companyLogoUrl}
					alt=""
				/>
			</div>
			<div className=" w-full h-[30%] flex flex-col justify-center items-center">
				<div
					style={{ fontFamily: "GoldmanSansBd" }}
					className="w-full h-[60%] flex items-center text-[2.6vmax] font-bold text-[#DDDDDD] pl-[0.5vmax]"
				>
					{props.companyName}
				</div>
				<div className="w-full h-[40%] flex items-start text-[#6A6A6A] font-light text-[1.2vmax] pl-[0.5vmax]">
					{props.userName} . {props.type} . {props.role} . {props.year}
				</div>
			</div>
			<div className="w-full h-[18%] flex flex-wrap gap-[0.5vmax] pl-[0.5vmax]">
				{props.tags.map((tag) => {
					return (
						<div key={tag} className="h-[40%]">
							<Tags tagName={tag} />
						</div>
					);
				})}
			</div>
			<div className="w-full h-[12%] flex justify-between items-center pl-[0.5vmax] pb-[0.3vmax]">
				<div className="h-[80%] w-[80%] flex justify-center items-center bg-[#FFD43B] rounded-md font-bold cursor-pointer text-[1.4vmax] text-[#242424]">
					Show Details
				</div>
				<div className="h-[90%] w-[20%] flex justify-center items-center cursor-pointer">
					<Bookmark color="#FFD43B" />
				</div>
			</div>
		</div>
	);
}

export default SubmissionCard;
