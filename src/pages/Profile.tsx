import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfilePicture from "../components/ProfilePicture";
import SubmissionCard from "../components/SubmissionCard";
import { DepartmentConfig } from "../utils/departmentConfig";
import { YearConfig } from "../utils/yearConfig";
import ErrorPage from "./ErrorPage";
import useGetProfile from "../hooks/useGetProfile";

function Profile() {
  const { user_id } = useParams<{ user_id: string }>();
  const { profile, error, fetchProfileDetails } = useGetProfile();
  const navigate = useNavigate();

  const getDepartment = useCallback(
    (dept: string | undefined): string | undefined => {
      if (dept === undefined) return "NA";
      const departmentConfig = new DepartmentConfig();
      return departmentConfig.getDepartment(dept);
    },
    []
  );

  const getYear = useCallback((yr: string | undefined): string | undefined => {
    if (yr === undefined) return "NA";
    const yearConfig = new YearConfig();
    return yearConfig.getYear(yr);
  }, []);

  const handleDreamCompanyClick = () => {
    navigate(`/company/${profile?.favouriteCompany?.id}`);
  };

  useEffect(() => {
    if (!user_id) {
      navigate("/error");
      return;
    }

    const submissionIdNum = Number(user_id);
    if (Number.isNaN(submissionIdNum)) {
      navigate("/error");
      return;
    }

    const controller = new AbortController();
    fetchProfileDetails(submissionIdNum, controller);
    return () => controller.abort();
  }, [user_id, fetchProfileDetails, navigate]);

  if (!profile || error) return <ErrorPage />;

  return (
    <div className="h-full w-full flex flex-col items-center gap-[2vmax] pt-[2vmax] overflow-auto">
      <div className="sm:w-[60%] w-[80%] rounded-[1vmax] sm:h-[20vmax] h-[35vmax] bg-(--fore-bg) flex sm:flex-row flex-col items-center p-[2vmax] sm:gap-0 gap-[1.8vmax]">
        <div className="sm:h-[10vmax] sm:w-[20%] w-full h-[40%] rounded-[1.5vmax] flex justify-start items-start">
          <div className="h-full w-[30%] sm:w-full object-center object-cover rounded-[1.5vmax]">
            <ProfilePicture profileUrl={profile.profileUrl ?? ""} />
          </div>
        </div>
        <div className="sm:w-[80%] w-full h-[10vmax] flex flex-col justify-center items-center text-(--text-light) sm:gap-0 gap-[0.5vmax]">
          <div
            style={{ fontFamily: "GoldmanSansBd" }}
            className="w-full h-fit flex items-end sm:text-[2vmax] text-[2.8vmax] sm:pt-0 pt-[8vmax] pl-[2vmax] text-(--text-heading)"
          >
            {profile.name}
          </div>
          <div className="w-full h-fit pl-[2vmax] sm:text-[1.1vmax] text-[1.5vmax]">
            {getDepartment(profile.department)}
          </div>
          <div className="w-full h-[15%] pl-[2vmax] sm:text-[1.1vmax] text-[1.5vmax]">
            {profile.email}
          </div>
          <div className="w-full h-[15%] pl-[2vmax] sm:text-[1.1vmax] text-[1.5vmax]">
            {profile.degree}
          </div>
          <div className="w-full h-[15%] pl-[2vmax] sm:text-[1.1vmax] text-[1.5vmax]">
            {getYear(profile.year?.toString())}
          </div>
        </div>
        <div className="sm:w-[20%] w-full h-full flex flex-col items-end justify-end gap-[0.7vmax]">
          <div className="font-light text-[#828282] pr-[0.4vmax] text-[1vmax]">
            Dream Company
          </div>
          <button
            type="button"
            onClick={handleDreamCompanyClick}
            className="cursor-pointer bg-transparent border-none p-0"
          >
            <img
              className="w-[7vmax] h-[3vmax] pr-[1vmax] object-contain"
              src={profile.favouriteCompany?.logoUrl}
              alt="Dream Company"
            />
          </button>
        </div>
      </div>
      <div className="w-[80%] h-fit rounded-[1vmax] bg-(--fore-bg) flex flex-wrap p-[2vmax] gap-[4vmax] items-center sm:justify-start justify-center mb-[2vmax]">
        {profile.mySubmissions?.map((sub) => {
          return (
            <div key={sub.id} className="w-[22vmax] h-[26vmax]">
              <SubmissionCard
                id={sub.id ?? 0}
                companyLogoUrl={sub.companyLogoUrl ?? "logo"}
                companyName={sub.companyName ?? ""}
                role={sub.role ?? ""}
                tags={sub.tags ?? []}
                type={sub.submissionType ?? ""}
                userName={sub.userName ?? ""}
                year={sub.year ?? 1}
                isFavourite={sub.favourite ?? false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
