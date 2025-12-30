import ProfileSidebar from "../components/ProfileSideBar"
import SubmissionCard from "../components/SubmissionCard"
import submissionJson from "../mocks/submissionCard.json"

const Home = () => {
  return (
    <div className="w-full h-full bg-(--bg) text-white flex justify-center">
      <div className="max-w-[92rem] w-full h-full px-[3vmax] flex gap-[3vmax]">

        <div className="hidden md:block pt-[2vmax]">
          <ProfileSidebar />
        </div>

        <div className="flex-1 bg-(--fore-bg) mt-4 mb-4 rounded-[1.6vmax] flex flex-col">
          <div className="flex-1 overflow-auto no-scrollbar pt-[1.5vmax] pb-[1.5vmax] px-[2.5vmax]">
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-[3.5vmax]
                justify-items-center
              "
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-[21vmax] h-[24vmax]">
                  <SubmissionCard
                    companyLogoUrl={submissionJson.companyLogoUrl}
                    companyName={submissionJson.companyName}
                    role={submissionJson.role}
                    tags={submissionJson.tags}
                    type={submissionJson.type}
                    userName={submissionJson.userName}
                    year={submissionJson.year}
                  />
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Home
