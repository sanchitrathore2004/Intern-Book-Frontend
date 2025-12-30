import { useContext } from "react"
import ProfilePicture from "./ProfilePicture"
import UserContext from "../contexts/UserContext"

const ProfileCard = () => {
  const { user } = useContext(UserContext)

  return (
    <div className="w-full bg-(--fore-bg) rounded-2xl px-6 py-5 shadow-md">
      <div className="flex items-center justify-between">
        <div className="w-20 h-20">
          <ProfilePicture />
        </div>

        <button className="w-8 h-8 bg-(--accent) text-black rounded-full flex items-center justify-center text-lg hover:scale-105 transition">
          +
        </button>
      </div>

      <div className="mt-5 bg-(--bg) rounded-xl p-4">
        <h3 className="text-(--text-heading) font-semibold text-base mb-4">
          {user.name}
        </h3>

        <div className="text-sm text-zinc-400 space-y-2">
          <div className="flex justify-between">
            <span className="text-zinc-500">Favourites</span>
            <span className="text-(--accent) font-medium">3</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Submissions</span>
            <span className="text-(--accent) font-medium">2</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard

