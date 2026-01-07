import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
	const navigate = useNavigate();
	const handleOnclick = () => {
		navigate("/home");
	};
	return (
		<>
			{/* desktop view */}
			<div className="hidden md:block h-full">
				<div className="flex items-center justify-around h-full">
					<div className="flex flex-col justify-center items-start p-16 gap-8">
						<div className="text-(--text-heading) text-3xl lg:text-5xl font-[GoldmanSansBd]">
							Something is not right...
						</div>
						<div className="text-(--text-light) text-md lg:text-xl">
							Page you are trying to open does not exist. You may have mistyped
							the address, or the page has been moved to another URL. If you
							think this is an error contact support.
						</div>
						<button
							type="button"
							onClick={handleOnclick}
							className="hover:bg-(--accent-bg) p-2 text-(--accent) border rounded-md border-(--accent) cursor-pointer transition-all active:scale-95"
						>
							Get back to home page
						</button>
					</div>
					<div className="min-w-[50vw] p-8">
						<img
							fetchPriority="high"
							src="/assets/svgs/image404.svg"
							alt="404"
						/>
					</div>
				</div>
			</div>
			{/* mobile view */}
			<div className="md:hidden h-full">
				<div className="flex flex-col items-center justify-around h-full">
					<div className="w-full sm:w-[70vw] p-8 pb-0">
						<img
							fetchPriority="high"
							className=""
							src="/assets/svgs/image404.svg"
							alt="404"
						/>
					</div>
					<div className="flex flex-col justify-center items-start max-w-[80vw] gap-8">
						<div className="text-(--text-heading) text-3xl font-[GoldmanSansBd]">
							Something is not right...
						</div>
						<div className="text-(--text-light) text-md">
							Page you are trying to open does not exist. You may have mistyped
							the address, or the page has been moved to another URL. If you
							think this is an error contact support.
						</div>
						<button
							type="button"
							onClick={handleOnclick}
							className="hover:bg-(--accent-bg) text-md p-2 text-(--accent) border rounded-md border-(--accent) cursor-pointer transition-all active:scale-95"
						>
							Get back to home page
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default ErrorPage;
