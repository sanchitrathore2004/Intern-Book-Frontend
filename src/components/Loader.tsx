import { DotLoader } from "react-spinners";

interface LoaderProps {
	size?: number;
	color?: string;
	fullscreen?: boolean;
}

const Loader = ({
	size = 80,
	color = "var(--text-light)",
	fullscreen = false,
}: LoaderProps) => {
	if (fullscreen) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-(--bg)">
				<DotLoader size={size} color={color} />
			</div>
		);
	}

	return <DotLoader size={size} color={color} />;
};

export default Loader;
