import AppIcon from "../assets/images/app_icon_light.png";
import BackgroundImage from "../assets/images/bgimage.png";
import DAuthLogo from "../assets/images/deltaLogo.svg";

const Login = () => {
	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-[#121212] relative overflow-hidden p-4">
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
				style={{ backgroundImage: `url(${BackgroundImage})` }}
			/>
			<div className="absolute top-0 left-0 w-full md:w-[35%] h-[35%] md:h-full bg-[#8a7a3a]/15 border-b md:border-b-0 md:border-r border-white/5 backdrop-blur-[1px] z-10" />
			<div className="relative z-20 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl">
				<div
					className="w-full max-w-[290px] md:max-w-[300px] h-[320px] md:h-[460px] bg-[#1a1a1a] 
            /* Mobile: Only top corners rounded. Laptop: All corners rounded */
            rounded-t-[40px] md:rounded-[40px] 
            shadow-2xl flex flex-col items-center justify-center md:justify-between p-8 md:p-10 text-center border border-white/10 
            /* z-index is lower than yellow card */
            z-20 md:z-30 md:-translate-y-8"
				>
					<div className="space-y-1 mb-6 md:mb-0">
						<p className="text-white text-base md:text-lg font-medium opacity-90">
							Welcome to
						</p>
						<h1 className="text-white text-3xl md:text-4xl font-serif italic tracking-tight">
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

					<p className="text-gray-400 text-[13px] tracking-widest uppercase hidden md:block">
						All your help in one place
					</p>
				</div>

				<div
					className="w-full max-w-[290px] md:max-w-[300px] h-[320px] md:h-[460px] bg-[#eef0bc] 
            /* All corners rounded to overlap the black card properly */
            rounded-[40px] 
            shadow-[0_-10px_25px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center p-8 md:p-10 
            /* z-index is higher to stay on top. -mt-16 pulls it over the black card */
            z-40 -mt-16 md:mt-0 md:translate-y-8 md:ml-10"
				>
					<div className="w-full text-left mb-8 md:mb-12">
						<h2 className="text-[34px] md:text-[42px] text-zinc-900 leading-[1.05] font-galdeano">
							<span className="block font-normal">Continue with</span>
							<span className="text-[#2d6a3e] block font-bold">DAuth!</span>
						</h2>
					</div>

					<button
						type="button"
						className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-2xl hover:bg-zinc-900 transition-all active:scale-95 shadow-xl"
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
