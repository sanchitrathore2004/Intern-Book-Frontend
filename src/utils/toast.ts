import { toast } from "react-toastify";

export const showSuccess = (msg: string) =>
	toast.success(msg, {
		position: "top-right",
		autoClose: 3500,
	});

export const showError = (msg: string) =>
	toast.error(msg, {
		position: "top-right",
		autoClose: 3500,
	});

export const showInfo = (msg: string) =>
	toast.info(msg, {
		position: "top-right",
	});

export const showWarning = (msg: string) =>
	toast.warning(msg, {
		position: "top-right",
	});
