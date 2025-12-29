interface TagProps {
	tagName: string;
}

function Tags(props: TagProps) {
	return (
		<div className="h-full w-fit p-[0.5vmax] bg-[#1E2C37] text-[#1971C2] text-[1.2vmax] font-medium flex justify-center items-center rounded-md">
			{props.tagName}
		</div>
	);
}

export default Tags;
