import { useEffect } from "react";

export default function DAuthCallback() {
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const code = params.get("code");
		const state = params.get("state");

		if (window.opener && code) {
			window.opener.postMessage(
				{
					source: "dauth-login-callback",
					code,
					state,
				},
				window.location.origin,
			);
			window.close();
		}
	}, []);

	return <p>Logging you in</p>;
}
