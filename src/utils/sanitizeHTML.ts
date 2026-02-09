import DOMPurify from "dompurify";

function decodeHtmlEntities(html: string): string {
	const txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}

export function sanitizeHtml(html: string): string {
	let cleanedHtml = decodeHtmlEntities(html);

	cleanedHtml = cleanedHtml.replace(/\u00A0/g, " ");

	return DOMPurify.sanitize(cleanedHtml, {
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
			"h1",
			"h2",
			"h3",
			"blockquote",
		],
		// MUST ALLOW CLASS for indentation to work
		ALLOWED_ATTR: ["href", "target", "rel", "class"],
	});
}
