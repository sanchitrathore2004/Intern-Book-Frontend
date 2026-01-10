import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { navigateWithModifiers } from "../utils/navigateWithModifiers";

interface InfoRowProps {
	label: string;
	value: string | undefined;
	companyId?: number;
}

export const InfoRow = (props: InfoRowProps) => {
	const navigate = useNavigate();

	const handlClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!props.companyId) return;
			navigateWithModifiers(e, navigate, `/company/${props.companyId}`);
		},
		[navigate, props.companyId],
	);

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
			e.preventDefault();
		}
	};

	return (
		<div className="grid grid-cols-2 min-w-60 lg:min-w-80">
			<div className="text-(--text-light) text-sm col-span-1">
				{props.label}
			</div>
			{props.companyId ? (
				// biome-ignore lint/a11y/useSemanticElements: <this is safely clickable>
				<div
					role="button"
					tabIndex={0}
					aria-label={`Open company ${props.value}`}
					onClick={handlClick}
					onKeyDown={onKeyDown}
					className="text-(--text-heading) hover:text-(--accent) cursor-pointer col-span-1"
				>
					{props.value || "NA"}
				</div>
			) : (
				<div className="text-(--text-heading) cursor-pointer col-span-1">
					{props.value || "NA"}
				</div>
			)}
		</div>
	);
};
