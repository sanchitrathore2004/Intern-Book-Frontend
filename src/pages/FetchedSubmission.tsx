import SubmissionCard from "../components/SubmissionCard";
import submissionJson from "../mocks/submissionCard.json";

const FetchedSubmission = () => {
  return (
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
          {submissionJson.map((submission, i) => (
            <div key={submission.id ?? i} className="w-[22vmax] h-[28vmax]">
              <SubmissionCard
                id={submission.id}
                companyLogoUrl={submission.companyLogoUrl}
                companyName={submission.companyName}
                role={submission.role}
                tags={submission.tags}
                type={submission.type}
                userName={submission.userName}
                year={Number.parseInt(submission.year, 10)}
                isFavourite={submission.isFavourite}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FetchedSubmission;
