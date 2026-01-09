import Quill from "quill";
import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

interface TextEditorProps {
	value: string;
	onChange: (value: string) => void;
	theme?: "light" | "dark";
	placeholder: string;
	size?: "small" | "medium";
}

const TextEditor = ({
	value,
	onChange,
	theme = "light",
	placeholder,
	size,
}: TextEditorProps) => {
	const editorRef = useRef<HTMLDivElement | null>(null);
	const quillRef = useRef<Quill | null>(null);
	const onChangeRef = useRef(onChange);

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		if (!editorRef.current || quillRef.current) return;

		const quill = new Quill(editorRef.current, {
			theme: "snow",
			placeholder,
			modules: {
				toolbar: [
					["bold", "italic", "underline"],
					[{ list: "ordered" }, { list: "bullet" }],
					["link"],
				],
			},
		});

		quill.on("text-change", () => {
			onChangeRef.current(quill.getSemanticHTML());
		});

		if (value) {
			quill.clipboard.dangerouslyPasteHTML(value);
		}

		quillRef.current = quill;
	}, [placeholder, value]);

	useEffect(() => {
		const quill = quillRef.current;
		if (!quill) return;

		const current = quill.getSemanticHTML();
		if (value !== current) {
			quill.clipboard.dangerouslyPasteHTML(value);
		}
	}, [value]);

	return (
		<div
			data-theme={theme}
			className={`quill-wrapper quill-${size ?? "medium"}`}
		>
			<div ref={editorRef} className="quill-editor" />
		</div>
	);
};

export default TextEditor;
