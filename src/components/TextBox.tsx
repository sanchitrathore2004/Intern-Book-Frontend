import { sanitizeHtml } from "../utils/sanitizeHTML";
import "quill/dist/quill.snow.css";

interface TextBoxProps {
	label: string;
	value: string;
}

function TextBox({ label, value }: TextBoxProps) {
	if (!value || value === "<p><br></p>") return null;

	return (
		<div className="col-span-10 w-full bg-(--fore-bg) py-8 px-6 md:px-10 rounded-[1.25rem] border border-(--line-color) shadow-sm">
			<div className="flex items-center gap-3 mb-6 border-b border-(--line-color) pb-4">
				<div className="w-1.5 h-6 bg-(--accent) rounded-full" />
				<h3 className="text-xs uppercase tracking-[0.2em] font-bold text-(--text-light)">
					{label}
				</h3>
			</div>

			<div
				className="experience-view text-(--text-heading) wrap-break-words"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <the embedded content is safely sanitized>
				dangerouslySetInnerHTML={{
					__html: sanitizeHtml(value),
				}}
			/>
		</div>
	);
}

export default TextBox;
