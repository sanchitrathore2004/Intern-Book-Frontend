import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
	AuthControllerApi,
	type DauthLoginRequest,
	type DauthLoginRequestDto,
	type JwtResponseDto,
	type UserDto,
} from "../../web-client/src/generated";
import { DAUTH_CLIENT_ID, DAUTH_REDIRECT_URI } from "../config/config";
import UserContext from "../contexts/UserContext";
import useRestoreUser from "../hooks/useRestoreUser";
import useValidateToken from "../hooks/useValidateToken";
import { authConfig } from "../utils/apiConfig";
import { showError } from "../utils/toast";

interface DauthQueryParameters {
	[key: string]: string;
}

const Login = () => {
	const isMobile = false;
	const navigate = useNavigate();
	const { dispatch } = useContext(UserContext);
	const userRestore = useRestoreUser();
	const [token, setToken] = useState(localStorage.getItem("token") || "");
	const { validateToken } = useValidateToken();
	const validateControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		setToken(localStorage.getItem("token") || "");
	}, []);

	const validateCurrentAccessToken = useCallback(
		async (token: string) => {
			validateControllerRef.current?.abort();
			const controller = new AbortController();
			validateControllerRef.current = controller;
			const status = await validateToken(token, validateControllerRef.current);
			if (status === 204) {
				navigate("/home");
			} else {
				localStorage.removeItem("token");
				navigate("/", { replace: true });
			}
		},
		[validateToken, navigate],
	);

	useEffect(() => {
		if (token) {
			validateCurrentAccessToken(token);
		}
	}, [token, validateCurrentAccessToken]);

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
				userRestore();
				navigate(
					{
						pathname: "/home",
						search: createSearchParams({
							view: "home",
						}).toString(),
					},
					{ state: { loggedIn: true } },
				);
			} catch (err) {
				console.error("Login failed:", err);
				showError("Login failed!");
			}
		},
		[dispatch, userRestore, navigate],
	);

	const BASE_URL =
		typeof window !== "undefined" ? window.location.origin : null;
	const processedCodesRef = useRef<Set<string>>(new Set());

	const receiveMessage = useCallback(
		(event: MessageEvent<{ source: string; code: string }>) => {
			if (event.origin !== BASE_URL) return;
			const { data } = event;
			if (data.source === "dauth-login-callback") {
				const code = data.code;
				if (code) {
					if (processedCodesRef.current.has(code)) return;
					processedCodesRef.current.add(code);
					setTimeout(() => processedCodesRef.current.delete(code), 10_000);
					sendAuthCodeToServer(code);
				}
			}
		},
		[BASE_URL, sendAuthCodeToServer],
	);

	const [windowObjectReference, setWindowObjectReference] =
		useState<Window | null>(null);
	const [previousUrl, setPreviousUrl] = useState<string | null>(null);

	const openSignInWindow = useCallback(
		(url: string, name: string) => {
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
			setPreviousUrl(url);
		},
		[previousUrl, windowObjectReference],
	);

	useEffect(() => {
		window.addEventListener("message", receiveMessage);
		return () => window.removeEventListener("message", receiveMessage);
	}, [receiveMessage]);

	const generateDauthStringAndOpenUrl = useCallback(() => {
		const dauthURL = generateDauthAuthorizeUrl();
		openSignInWindow(dauthURL.toString(), "dauthURL");
	}, [openSignInWindow, generateDauthAuthorizeUrl]);

	const handleDAuthLogin = () => {
		generateDauthStringAndOpenUrl();
	};

	const LoginButton = () => (
		<button
			type="button"
			onClick={handleDAuthLogin}
			className="group relative inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full border border-white/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(96,165,250,0.3)] active:scale-95 overflow-hidden"
		>
			<div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />

			<span className="font-medium tracking-wide z-10">Login with DAuth</span>
			<img
				src="/assets/svgs/deltaLogo.svg"
				alt="DAuth"
				className="w-5 h-5 z-10 transition-transform group-hover:rotate-12"
			/>
		</button>
	);
	const FeatureCard = ({ title, desc }: { title: string; desc: string }) => (
		<div className="group relative p-8 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07] hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/10">
			<h4 className="text-white font-semibold text-xl mb-3 group-hover:text-blue-400 transition-colors">
				{title}
			</h4>
			<p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300">
				{desc}
			</p>
		</div>
	);

	return (
		<div className="min-h-screen w-full bg-gradient-to-b from-[#1a2332] via-[#0f1522] to-black text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
			<ToastContainer newestOnTop />
			<div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

			<div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-24 flex flex-col items-center">
				<div className="flex flex-col items-center text-center mb-20 md:mb-32 animate-fade-in-up">
					<div className="relative mb-8">
						<div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
						<img
							fetchPriority="high"
							src="/assets/images/app_icon_light.png"
							className="relative w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-xl"
							alt="Logo"
						/>
					</div>

					<h2 className="text-slate-300 text-lg md:text-xl font-medium tracking-widest uppercase mb-4 opacity-80">
						Welcome to
					</h2>
					<h1 className="text-5xl md:text-7xl font-serif italic mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-slate-400 pb-2">
						InternBook!
					</h1>
					<p className="text-slate-400 text-lg md:text-xl tracking-wide font-light mb-10 max-w-lg mx-auto">
						All your campus internship help in one place.
					</p>

					<LoginButton />
				</div>
				<div className="w-full mb-24 text-center">
					<div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-[0.2em] uppercase mb-6">
						The Mission
					</div>
					<p className="text-slate-300 leading-relaxed text-lg md:text-2xl max-w-4xl mx-auto font-light">
						<span className="text-white font-medium">InternBook</span> is a
						centralized platform where students share real internship and
						placement experiences —{" "}
						<span className="text-blue-400">structured</span>,{" "}
						<span className="text-blue-400">searchable</span>, and built for
						your campus.
					</p>
				</div>
				<div className="w-full mb-24">
					<div className="flex items-center gap-4 mb-10 opacity-60">
						<div className="h-px bg-gradient-to-r from-transparent to-white/30 flex-1" />
						<h3 className="text-sm font-bold tracking-widest text-white uppercase">
							The Problem
						</h3>
						<div className="h-px bg-gradient-to-l from-transparent to-white/30 flex-1" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<FeatureCard
							title="Scattered Information"
							desc="Experiences buried in WhatsApp chats, Google Docs, and random PDFs are impossible to track."
						/>
						<FeatureCard
							title="Hard to Find"
							desc="No filters, no structure, no way to search by company or role when you need it most."
						/>
						<FeatureCard
							title="Knowledge Drain"
							desc="Seniors graduate and their valuable experience leaves campus with them."
						/>
					</div>
				</div>
				<div className="w-full text-center py-12 mb-24 relative">
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-32 bg-blue-500/5 blur-3xl -z-10" />
					<h2 className="text-blue-300/90 font-serif italic text-3xl md:text-4xl leading-relaxed max-w-3xl mx-auto">
						"InternBook turns scattered advice into a permanent knowledge base."
					</h2>
				</div>
				<div className="w-full mb-24 flex flex-col items-center text-center">
					<div className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase mb-6">
						Impact
					</div>
					<div className="text-slate-300 text-lg md:text-xl max-w-2xl space-y-2 font-light">
						<p>Every batch contributes once.</p>
						<p>Every future batch benefits forever.</p>
						<p className="pt-4 text-slate-400 text-base">
							Reducing anxiety, confusion, and misinformation during placement
							season.
						</p>
					</div>
				</div>
				<div className="w-full mb-32">
					<div className="flex items-center gap-4 mb-10 opacity-60">
						<div className="h-px bg-gradient-to-r from-transparent to-white/30 flex-1" />
						<h3 className="text-sm font-bold tracking-widest text-white uppercase">
							The Solution
						</h3>
						<div className="h-px bg-gradient-to-l from-transparent to-white/30 flex-1" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<FeatureCard
							title="Curated Content"
							desc="Carefully structured experiences written by seniors. Organized for clarity — no noise."
						/>
						<FeatureCard
							title="Powerful Search"
							desc="Find exactly what you need using smart filters by company, role, domain, and process details."
						/>
						<FeatureCard
							title="Campus Exclusive"
							desc="Accessible only to NITT students via DAuth. Save experiences offline and read anytime."
						/>
					</div>
				</div>
				<div className="flex flex-col items-center text-center space-y-8 mb-20 relative">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 blur-[80px] rounded-full -z-10" />

					<p className="text-slate-400 text-lg tracking-wide">
						Ready to prepare smarter?
					</p>
					<h2 className="text-4xl md:text-6xl font-serif italic text-white">
						Let's Begin.
					</h2>
					<div className="pt-2">
						<LoginButton />
					</div>
				</div>
				<div className="pb-8 text-center border-t border-white/5 w-full pt-8">
					<p className="text-slate-500 text-sm">
						Made with <span className="text-red-500 animate-pulse">❤</span> by{" "}
						<span className="font-bold text-slate-300">ASS</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
