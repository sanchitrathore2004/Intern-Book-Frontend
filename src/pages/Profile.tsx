import SubmissionCard from "../components/SubmissionCard";
import submissionJson from "../mocks/submissionCard.json";

function Profile() {
  return (
    <div className="h-full w-full flex flex-col items-center gap-[2vmax] pt-[2vmax] overflow-auto">
      <div className="w-[60%] rounded-[1vmax] h-[40%vmax] bg-[#2E2E2E] flex items-center p-[2vmax]">
        <div className="h-[10vmax] w-[20%] rounded-[1.5vmax]">
          <img
            className="h-full w-full object-center object-cover rounded-[1.5vmax]"
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
            alt=""
          />
        </div>
        <div>sanchit</div>
      </div>
      <div className="w-[80%] h-fit rounded-[1vmax] bg-[#2E2E2E] flex flex-wrap p-[2vmax] gap-[4vmax] items-center">
        <div className="w-[22vmax] h-[26vmax]">
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
        <div className="w-[22vmax] h-[26vmax]">
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
        <div className="w-[22vmax] h-[26vmax]">
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
      </div>
    </div>
  );
}

export default Profile;
