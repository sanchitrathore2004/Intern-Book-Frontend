import DOMPurify from "dompurify";

export const sanitizeHtml = (html: string) =>
	DOMPurify.sanitize(html, {
		ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "ul", "ol", "li", "a"],
		ALLOWED_ATTR: ["href", "target", "rel"],
	});
