import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface InfoRowProps {
	label: string;
	value: string;
	companyId?: number;
}

export const InfoRow = (props: InfoRowProps) => {
	const navigate = useNavigate();

	const handlClick = useCallback(() => {
		if (!props.companyId) return;

		navigate(`/company/${props.companyId}`);
	}, [navigate, props.companyId]);

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
			e.preventDefault();
		}
	};

	return (
		<div className="grid grid-cols-2">
			<div className="text-(--text-light) text-sm col-span-1">
				{props.label}
			</div>
			{props.companyId ? (
				// biome-ignore lint/a11y/useSemanticElements: <explanation>
				<div
					role="button"
					tabIndex={0}
					aria-label={`Open company ${props.value}`}
					onClick={handlClick}
					onKeyDown={onKeyDown}
					className="text-(--text-heading) hover:text-(--accent) cursor-pointer col-span-1"
				>
					{props.value ?? "---"}
				</div>
			) : (
				<div className="text-(--text-heading) cursor-pointer col-span-1">
					{props.value ?? "---"}
				</div>
			)}
		</div>
	);
};
