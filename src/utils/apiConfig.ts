import { Configuration } from "../../web-client/src/generated/runtime";
import { API_URL } from "../config/config";

export class ApiError extends Error {
	status: number;
	message: string;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
		this.message = message;
	}
}

export const apiConfig = new Configuration({
	basePath: API_URL,
	headers: {},
	middleware: [
		{
			pre: async (context) => {
				const headers = context.init.headers;
				context.init.headers = {
					...headers,
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				};
				return context;
			},
			post: async (context) => {
				const statusCode = context.response.status;
				if (statusCode === 401 || statusCode === 403) {
					localStorage.removeItem("token");
				}
				if (statusCode >= 400) {
					const body = await context.response.json();
					throw new ApiError(
						statusCode,
						body?.error ?? "Currently our service is down",
					);
				}
				return context.response;
			},
		},
	],
});

export const authConfig = new Configuration({
	basePath: API_URL,
	headers: {},
	middleware: [
		{
			post: async (context) => {
				const status = context.response.status;
				console.log(context);
				if (status >= 400) {
					const body = await context.response.json();
					throw new ApiError(
						status,
						body?.message ?? "Currently our service is down",
					);
				}
				return context.response;
			},
		},
	],
});
