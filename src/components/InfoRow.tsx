export const InfoRow = ({
	label,
	value,
}: {
	label: string;
	value: string | null;
}) => {
	return (
		<div className="grid grid-cols-2">
			<div className="text-(--text-light) text-sm col-span-1">{label}</div>
			<div className="text-(--text-heading) col-span-1">{value ?? "---"}</div>
		</div>
	);
};
