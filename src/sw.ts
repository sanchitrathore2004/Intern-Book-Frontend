/// <reference lib="webworker" />

import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import {
	cleanupOutdatedCaches,
	matchPrecache,
	precacheAndRoute,
} from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

const networkFirst = new NetworkFirst({
	cacheName: "network-first",
	networkTimeoutSeconds: 8,
	plugins: [
		new CacheableResponsePlugin({ statuses: [0, 200] }),
		new ExpirationPlugin({
			maxEntries: 200,
			maxAgeSeconds: 7 * 24 * 60 * 60,
		}),
	],
});

registerRoute(
	({ request }) => request.mode === "navigate",
	(args) => networkFirst.handle(args),
);

registerRoute(
	({ request }) => request.method === "GET",
	(args) => networkFirst.handle(args),
);

setCatchHandler(async ({ event }) => {
	const fetchEvent = event as FetchEvent;
	if (fetchEvent.request.mode === "navigate") {
		const cachedShell = await matchPrecache("/index.html");
		if (cachedShell) return cachedShell;

		return new Response("Offline", {
			status: 503,
			headers: { "Content-Type": "text/plain; charset=utf-8" },
		});
	}

	return Response.error();
});
