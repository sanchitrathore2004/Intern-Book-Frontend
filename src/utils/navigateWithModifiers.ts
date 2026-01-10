import type { KeyboardEvent, MouseEvent } from "react";
import {
	createPath,
	type NavigateFunction,
	type NavigateOptions,
	type To,
} from "react-router-dom";

type ModifierEvent = MouseEvent<Element> | KeyboardEvent<Element>;

function shouldOpenInNewTab(event: ModifierEvent): boolean {
	// Ctrl (Win/Linux) or Cmd (macOS). Middle-click is handled by real <a> tags,
	// but for non-anchor click handlers this at least covers Ctrl/Cmd-click.
	const isMouseEvent = "button" in event;
	const isMiddleClick = isMouseEvent && event.button === 1;
	return event.ctrlKey || event.metaKey || isMiddleClick;
}

export function navigateWithModifiers(
	event: ModifierEvent,
	navigate: NavigateFunction,
	to: To,
	opts?: NavigateOptions,
): boolean {
	if (shouldOpenInNewTab(event)) {
		event.preventDefault();
		event.stopPropagation();
		const url = typeof to === "string" ? to : createPath(to);
		window.open(url, "_blank", "noopener,noreferrer");
		return true;
	}

	navigate(to, opts);
	return false;
}
