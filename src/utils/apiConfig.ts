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

let isRefreshing = false;
let refreshFailed = false;
let refreshSubscribers: Array<(token: string) => void> = [];
let failedRefreshSubscribers: Array<() => void> = [];

function subscribeTokenRefresh(
	onSuccess: (token: string) => void,
	onFailure: () => void,
) {
	refreshSubscribers.push(onSuccess);
	failedRefreshSubscribers.push(onFailure);
}

function onTokenRefreshed(token: string) {
	refreshSubscribers.forEach((cb) => {
		cb(token);
	});
	refreshSubscribers = [];
	failedRefreshSubscribers = [];
}

function onTokenRefreshFailed() {
	failedRefreshSubscribers.forEach((cb) => {
		cb();
	});
	refreshSubscribers = [];
	failedRefreshSubscribers = [];
}

async function refreshAccessToken(): Promise<string | null> {
	try {
		const response = await fetch(`${API_URL}/auth/refresh`, {
			method: "POST",
			credentials: "include",
		});
		if (!response.ok) {
			return null;
		}
		const data = await response.json();
		return data.accessToken ?? null;
	} catch {
		return null;
	}
}

export const apiConfig = new Configuration({
	basePath: API_URL,
	credentials: "include",
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

				if (statusCode === 401) {
					// If a refresh already failed recently, don't retry – let calling code handle it
					if (refreshFailed) {
						localStorage.removeItem("token");
						throw new ApiError(401, "Session expired. Please login again.");
					}

					// Attempt a silent token refresh
					if (!isRefreshing) {
						isRefreshing = true;
						const newToken = await refreshAccessToken();
						isRefreshing = false;

						if (newToken) {
							refreshFailed = false;
							localStorage.setItem("token", newToken);
							onTokenRefreshed(newToken);

							// Retry the original request with the new token
							const retryResponse = await context.fetch(context.url, {
								...context.init,
								headers: {
									...context.init.headers,
									Authorization: `Bearer ${newToken}`,
								},
							});
							return retryResponse;
						}

						// Refresh failed – prevent further retries, clear token
						refreshFailed = true;
						onTokenRefreshFailed();
						localStorage.removeItem("token");
						throw new ApiError(401, "Session expired. Please login again.");
					}

					// Another refresh is already in flight – wait for it
					return new Promise<Response>((resolve, reject) => {
						subscribeTokenRefresh(
							async (token: string) => {
								try {
									const retryResponse = await context.fetch(context.url, {
										...context.init,
										headers: {
											...context.init.headers,
											Authorization: `Bearer ${token}`,
										},
									});
									resolve(retryResponse);
								} catch (err) {
									reject(err);
								}
							},
							() => {
								reject(
									new ApiError(401, "Session expired. Please login again."),
								);
							},
						);
					});
				}

				if (statusCode === 403) {
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

// ── Auth config (login / validate – no token refresh) ────────────────
export const authConfig = new Configuration({
	basePath: API_URL,
	credentials: "include",
	headers: {},
	middleware: [
		{
			post: async (context) => {
				const status = context.response.status;
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
