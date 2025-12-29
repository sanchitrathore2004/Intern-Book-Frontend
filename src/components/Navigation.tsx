import appIcon from "../assets/images/app_icon.png";
import { Bookmark, Sun } from "lucide-react";

interface NavigationBarProps {
  profilePictureUrl: string;
}

function Navigation(props: NavigationBarProps) {
  return (
    <div className="w-full h-full flex justify-between items-center border-b border-[#424242]">
      <div className="w-[50%] h-full flex items-center gap-[1.7vmax]">
        <div className="h-full w-fit flex items-center pl-[1.5vmax]">
          <img className="h-[3.7vmax]" src={appIcon} alt="" />
        </div>
        <div
          style={{
            fontFamily: "GoldmanSansLt",
            fontSize: "2vmax",
          }}
          className="h-full flex items-center pt-[0.8vmax] text-white"
        >
          Intern Book
        </div>
      </div>
      <div className="w-[50%] h-full flex items-center justify-end gap-[1.5vmax] pr-[1.5vmax]">
        <input
          type="text"
          placeholder="Search"
          className="h-[2.9vmax] w-[18vmax] bg-[#313131] border border-[#585858] rounded-[0.6vmax] text-white pl-[1vmax] pr-[1vmax] flex items-center
                    justify-center
                    cursor-pointer
                    transition-all duration-200
                    hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]"
        />
        <div
          className="h-[2.9vmax] w-[3vmax]
            bg-[#313131]
            border border-[#585858]
            rounded-[0.6vmax]
            flex justify-center items-center
            cursor-pointer
            transition-all duration-200
            hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]"
        >
          <Bookmark color="#E5A000" fill="#E5A000" />
        </div>
        <div className="h-[2.9vmax] w-[3vmax] bg-[#313131] rounded-[0.6vmax]">
          <img
            className="h-full w-full object-cover object-center 
                    bg-[#313131]
                    border border-[#585858]
                    rounded-[0.6vmax]
                    flex justify-center items-center
                    cursor-pointer
                    transition-all duration-200
                    hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]"
            src={props.profilePictureUrl}
            alt=""
          />
        </div>
        <div
          className="h-[2.9vmax] w-[3vmax]
                    bg-[#313131]
                    border border-[#585858]
                    rounded-[0.6vmax]
                    flex justify-center items-center
                    cursor-pointer
                    transition-all duration-200
                    hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]"
        >
          <Sun color="#BAB9B9" />
        </div>
      </div>
    </div>
  );
}

export default Navigation;
