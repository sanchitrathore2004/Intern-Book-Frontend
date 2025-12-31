const TextBox = ({ label, value }: { label: string; value: string | null }) => {
	return (
		<div className="col-span-10 p-5 rounded-[0.75em] md:rounded-[1.5em] w-fit flex flex-col bg-(--fore-bg)">
			<div className="md:text-lg text-(--text-light) mb-1">{label}</div>
			<div className="md:text-lg text-(--text-heading)">{value}</div>
		</div>
	);
};

export default TextBox;
