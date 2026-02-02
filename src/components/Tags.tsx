interface TagProps {
	tagName: string;
}

function Tags(props: TagProps) {
	return (
		<div className="h-full w-fit p-[0.5vmax] bg-(--accent-bg) text-(--accent) text-[1.3vmax] sm:text-[0.8vmax] font-medium flex justify-center items-center rounded-md">
			{props.tagName}
		</div>
	);
}

export default Tags;
