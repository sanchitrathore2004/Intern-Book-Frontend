import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  CompanyPageResponseDto,
  GetCompanyRequest,
} from "../../web-client/src/generated";
import { CompanyControllerApi } from "../../web-client/src/generated/apis";
import SubmissionCard from "../components/SubmissionCard";
import { apiConfig } from "../utils/apiConfig";
import ErrorPage from "./ErrorPage";

function Company() {
  const { company_id } = useParams<{ company_id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CompanyPageResponseDto | null>(null);

  const fetchCompanyDetails = useCallback(
    async (companyId: number, controller: AbortController) => {
      try {
        const companyControllerApi = new CompanyControllerApi(apiConfig);
        const request: GetCompanyRequest = { companyId };

        const res: CompanyPageResponseDto =
          await companyControllerApi.getCompany(request, {
            signal: controller.signal,
          });

        if (!res) throw new Error("Some error occured");

        setData(res);
      } catch (er) {
        const msg = er instanceof Error ? er.message : String(er);
        console.error("Submission fetch failed:", msg);
        navigate("/error");
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!company_id) {
      navigate("/error");
      return;
    }

    const submissionIdNum = Number(company_id);
    if (Number.isNaN(submissionIdNum)) {
      navigate("/error");
      return;
    }

    const controller = new AbortController();
    fetchCompanyDetails(submissionIdNum, controller);
    return () => controller.abort();
  }, [company_id, fetchCompanyDetails, navigate]);

  if (!data) return <ErrorPage />;

  return (
    <div className="h-full w-full flex flex-col items-center gap-[2vmax] pt-[2vmax] overflow-auto">
      <div className="sm:w-[60%] w-[80%] rounded-[1vmax] sm:h-[50vmax] h-[60vmax] bg-(--fore-bg) flex flex-col items-center p-[2vmax] sm:gap-0 gap-[1.8vmax]">
        <div className="w-full h-[50%] flex justify-start items-center p-[0.8vmax]">
          <img
            className="w-[25vmax] h-[12vmax] object-contain"
            src={data.logoUrl}
            alt="company"
          />
        </div>
        <div
          style={{ fontFamily: "GoldmanSansBd" }}
          className="w-full h-[20%] flex justify-start items-center text-[4vmax] font-semibold text-(--text-heading) p-[0.8vmax]"
        >
          {data.name}
        </div>
        <div className="w-full h-fit fles justiyf-start items-center p-[0.8vmax] text-(--text-light) text-[1.1vmax]">
          {data.description} {data.favoriteCount} Favourite Counts
        </div>
        <div className="w-full h-[10%] flex justify-start items-center p-[0.8vmax]">
          <button
            type="button"
            className="w-[8vmax] h-[3vmax] rounded-[2vmax] bg-(--accent-bg) text-(--accent) text-[1.5vmax]"
          >
            Dream
          </button>
        </div>
        <div className="w-full h-[10%] flex flex-row justify-center items-center p-[0.8vmax] text-[1.1vmax]">
          <div className="w-[30%] h-full flex justify-center items-center flex-col gap-[1vmax]">
            <div className="w-full h-1/2 flex justify-center items-center text-(--text-light)">
              Average CTC
            </div>
            <div className="w-full h-1/2 flex justify-center items-center text-(--text-heading)">
              {data.averageCtc} LPA
            </div>
          </div>
          <div className="w-[30%] h-full flex justify-center items-center flex-col gap-[1vmax]">
            <div className="w-full h-1/2 flex justify-center items-center text-(--text-light)">
              Average Base
            </div>
            <div className="w-full h-1/2 flex justify-center items-center text-(--text-heading)">
              {data.averageBase} LPA
            </div>
          </div>
          <div className="w-[30%] h-full flex justify-center items-center flex-col gap-[1vmax]">
            <div className="w-full h-1/2 flex justify-center items-center text-(--text-light)">
              Average Stipend
            </div>
            <div className="w-full h-1/2 flex justify-center items-center text-(--text-heading)">
              {data.averageStipend} LPM
            </div>
          </div>
        </div>
      </div>
      <div className="w-[80%] h-fit rounded-[1vmax] bg-(--fore-bg) flex flex-wrap p-[2vmax] gap-[4vmax] items-center sm:justify-start justify-center mb-[2vmax]">
        {data.submission?.map((sub) => {
          return (
            <div key={sub.id} className="w-[22vmax] h-[26vmax]">
              <SubmissionCard
                id={sub.id ?? 0}
                companyLogoUrl={sub.companyLogoUrl ?? sub.companyName ?? "alt"}
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

export default Company;
