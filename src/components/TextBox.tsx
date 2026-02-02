import { sanitizeHtml } from "../utils/sanitizeHTML";
import "quill/dist/quill.snow.css";

interface TextBoxProps {
	label: string;
	value: string;
}

function TextBox({ label, value }: TextBoxProps) {
	return (
		<div className="col-span-10 w-full bg-(--fore-bg) py-5 px-6 md:px-10 rounded-[0.75em] md:rounded-[1.5em]">
			<h3 className="mb-3 text-lg font-medium text-(--text-light)">{label}</h3>
			<div className="ql-snow">
				<div
					className="ql-editor experience-view"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: suppressed because it is alright
					dangerouslySetInnerHTML={{
						__html: sanitizeHtml(value),
					}}
				/>
			</div>
		</div>
	);
}

export default TextBox;
