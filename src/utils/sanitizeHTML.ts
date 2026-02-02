import DOMPurify from "dompurify";

function decodeHtmlEntities(html: string): string {
	const txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}

export function sanitizeHtml(html: string): string {
	const decoded = decodeHtmlEntities(html);

	return DOMPurify.sanitize(decoded, {
		ALLOWED_TAGS: [
			"p",
			"br",
			"strong",
			"em",
			"u",
			"ul",
			"ol",
			"li",
			"a",
			"dl",
			"h1",
			"h2",
			"h3",
		],
		ALLOWED_ATTR: ["href", "target", "rel"],
	});
}
