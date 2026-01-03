import { toast } from "react-toastify";

export const showSuccess = (msg: string, time?: number) =>
	toast.success(msg, {
		position: "top-right",
		autoClose: time ?? 3500,
	});

export const showError = (msg: string, time?: number) =>
	toast.error(msg, {
		position: "top-right",
		autoClose: time ?? 3500,
	});

export const showInfo = (msg: string, time?: number) =>
	toast.info(msg, {
		position: "top-right",
		autoClose: time ?? false,
	});

export const showWarning = (msg: string, time?: number) =>
	toast.warning(msg, {
		position: "top-right",
		autoClose: time ?? false,
	});
