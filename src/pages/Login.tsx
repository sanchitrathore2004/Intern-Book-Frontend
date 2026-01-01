import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	AuthControllerApi,
	type DauthLoginRequest,
	type DauthLoginRequestDto,
	type JwtResponseDto,
	type UserDto,
} from "../../web-client/src/generated";
import AppIcon from "../assets/images/app_icon_light.png";
import BackgroundImage from "../assets/images/bgimage.png";
import DAuthLogo from "../assets/images/deltaLogo.svg";
import { DAUTH_CLIENT_ID, DAUTH_REDIRECT_URI } from "../config/config";
import UserContext from "../contexts/UserContext";
import { authConfig } from "../utils/apiConfig";

interface DauthQueryParameters {
	[key: string]: string;
}

const Login = () => {
	const isMobile = false;
	const navigate = useNavigate();
	const { dispatch } = useContext(UserContext);

	//  generate the api to call it to get the authorization code
	const generateDauthAuthorizeUrl = useCallback(() => {
		const dauthAuthorizeURL = new URL("https://auth.delta.nitt.edu/authorize");

		const dauthQueryParameters: DauthQueryParameters = {
			client_id: DAUTH_CLIENT_ID,
			redirect_uri: DAUTH_REDIRECT_URI,
			response_type: "code",
			state: "code",
			grant_type: "authorization_code",
			scope: "email+openid+profile+user",
			nonce: "",
		};

		const appendQueryParametersToURL = (
			url: URL,
			queryParams: DauthQueryParameters,
		) => {
			Object.keys(queryParams).forEach((query: string) => {
				url.searchParams.append(query, queryParams[query]);
			});
		};

		appendQueryParametersToURL(dauthAuthorizeURL, dauthQueryParameters);

		return dauthAuthorizeURL;
	}, []);

	//  send the authorizationCode to backend and receive the token and save it in localstorage
	const sendAuthCodeToServer = useCallback(
		async (code: string) => {
			try {
				const request: DauthLoginRequestDto = { authorizationCode: code };
				const dto: DauthLoginRequest = { dauthLoginRequestDto: request };

				const authApi = new AuthControllerApi(authConfig);
				const res: JwtResponseDto = await authApi.dauthLogin(dto);

				const user: UserDto | undefined = res.userDto;
				if (!res.accessToken || !user) {
					throw new Error("Invalid auth response");
				}

				localStorage.setItem("token", res.accessToken);
				dispatch({ type: "UPDATE_PROFILE", payload: user });

				navigate("/home");
				console.log("Logged in successfully");
			} catch (err) {
				console.error("Login failed:", err);
			}
		},
		[navigate, dispatch],
	);

	//  get the current window url
	const BASE_URL =
		typeof window !== "undefined" ? window.location.origin : null;

	//  get the authorization code from the Url

	const receiveMessage = useCallback(
		(event: MessageEvent<{ source: string; code: string }>) => {
			if (event.origin !== BASE_URL) {
				return;
			}
			const { data } = event;
			console.log("source", data, data.source);
			if (data.source === "dauth-login-callback") {
				if (data.code) {
					sendAuthCodeToServer(data.code);
				}
			}
		},
		[BASE_URL, sendAuthCodeToServer],
	);

	//	safely opens a sign-in popup,
	//	listens for the auth response via receiveMessage
	//	avoids duplicate windows.
	const [windowObjectReference, setWindowObjectReference] =
		useState<Window | null>(null);
	const [previousUrl, setPreviousUrl] = useState<string | null>(null);

	const openSignInWindow = useCallback(
		(url: string, name: string) => {
			console.log("openSignInWindow");
			//   window.removeEventListener("message", receiveMessage);

			const strWindowFeatures = isMobile
				? "_blank"
				: "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

			if (windowObjectReference === null || windowObjectReference.closed) {
				setWindowObjectReference(window.open(url, name, strWindowFeatures));
			} else if (previousUrl !== url) {
				setWindowObjectReference(window.open(url, name, strWindowFeatures));
				windowObjectReference?.focus();
			} else {
				windowObjectReference.focus();
			}

			window.addEventListener("message", receiveMessage, false);

			setPreviousUrl(url);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[previousUrl, receiveMessage, windowObjectReference],
	);

	const generateDauthStringAndOpenUrl = useCallback(() => {
		const dauthURL = generateDauthAuthorizeUrl();
		openSignInWindow(dauthURL.toString(), "dauthURL");
	}, [openSignInWindow, generateDauthAuthorizeUrl]);

	const handleDAuthLogin = () => {
		generateDauthStringAndOpenUrl();
	};

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-(--bg) relative overflow-hidden p-4">
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
				style={{ backgroundImage: `url(${BackgroundImage})` }}
			/>
			<div className="absolute top-0 left-0 w-full md:w-[35%] h-[35%] md:h-full bg-[#8a7a3a]/15 border-b md:border-b-0 md:border-r border-white/5 backdrop-blur-[1px] z-10" />
			<div className="relative z-20 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl">
				<div
					className="w-full max-w-72.5 md:max-w-75 h-80 md:h-115 bg-(--bg) 
            /* Mobile: Only top corners rounded. Laptop: All corners rounded */
            rounded-t-[40px] md:rounded-[40px] 
            shadow-2xl flex flex-col items-center justify-center md:justify-between p-8 md:p-10 text-center border border-(--border-color)
            /* z-index is lower than yellow card */
            z-20 md:z-30 md:-translate-y-8"
				>
					<div className="space-y-1 mb-6 md:mb-0">
						<p className="text-(--text-heading) text-base md:text-lg font-medium opacity-90">
							Welcome to
						</p>
						<h1 className="text-(--text-heading) text-3xl md:text-4xl font-serif italic tracking-tight">
							InternBook!
						</h1>
					</div>

					<div className="mb-8 md:mb-0">
						<img
							src={AppIcon}
							alt="InternBook Logo"
							className="w-20 h-20 md:w-24 md:h-24 object-contain"
						/>
					</div>

					<p className="text-(--text-light) text-[0.8em] tracking-widest uppercase hidden md:block">
						All your help in one place
					</p>
				</div>

				<div
					className="w-full max-w-72.5 md:max-w-75 h-80 md:h-115 bg-[#eef0bc] 
            rounded-[40px] 
            shadow-[0_-10px_25px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center p-8 md:p-10 
            z-40 -mt-16 md:mt-0 md:translate-y-8 md:ml-10"
				>
					<div className="w-full text-left mb-8 md:mb-12">
						<h2 className="text-[34px] md:text-[42px] text-(--bg) leading-[1.05] font-galdeano">
							<span className="block font-normal">Continue with</span>
							<span className="text-[#2d6a3e] block font-bold">DAuth!</span>
						</h2>
					</div>

					<button
						type="button"
						onClick={handleDAuthLogin}
						className="w-full flex items-center justify-center gap-3 bg-(--bg) hover:bg-black text-(--text-heading) py-3 rounded-2xl transition-all active:scale-95 shadow-xl"
					>
						<span className="text-sm font-medium opacity-80">Login with</span>
						<img
							src={DAuthLogo}
							alt="DAuth Logo"
							className="h-5 w-5 object-contain"
						/>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Login;
