import { sanitizeHtml } from "../utils/sanitizeHTML";

interface TextBoxProps {
	label: string;
	value: string;
}

function TextBox({ label, value }: TextBoxProps) {
	return (
		<div className="col-span-10 bg-(--fore-bg) p-5 rounded-[0.75em] md:rounded-[1.5em]">
			<h3 className="mb-3 text-lg font-medium">{label}</h3>

			<div
				className="experience-view"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: sanitizeHtml(value),
				}}
			/>
		</div>
	);
}

export default TextBox;
