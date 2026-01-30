import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "../components/Loader";
import TextEditor from "../components/TextEditor";
import { useTheme } from "../contexts/ThemeContext";
import UserContext from "../contexts/UserContext";
import useCreateSubmission from "../hooks/useCreateSubmission";
import useGetAllCompany from "../hooks/useGetAllCompany";
import useGetAllDomains from "../hooks/useGetAllDomains";
import type { SubmissionFormData } from "../interfaces/submissionSchema";
import { submissionSchema } from "../interfaces/submissionSchema";
import useGetSubmissions from "../hooks/useGetSubmissions";
import useUpdateSubmission from "../hooks/useUpdateSubmission";

const SubmissionForm = () => {
	const navigate = useNavigate();
	const { user } = useContext(UserContext);
	const { theme } = useTheme();
	const { id } = useParams();
	const isEditMode = Boolean(id);
	const submissionId = id ? Number(id) : undefined;
	const { data, isLoading, error } = useGetSubmissions(submissionId);

	useEffect(()=>{
       if(id && data && data?.authorId !== user.id){
		navigate(`/error`);
	   }
	}, [data?.authorId, id, user.id, navigate, data])

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(submissionSchema),
		defaultValues: {
			experience: "",
		},
	});

	const {
		data: companies = [],
		isLoading: companyLoading,
		error: companyError,
	} = useGetAllCompany();

	const {
		data:domains=[],
		isLoading: roleLoading,
		error: roleError,
	} = useGetAllDomains();

	useEffect(() => {
		if (!isEditMode) return;

		const loadSubmission = async () => {
			if (!data) return;

			reset({
				company: data.company?.id?.toString(),
				domain: data.domain?.id?.toString(),
				type: data.type,
				domainDescription: data.domainDescription,
				experience: data.experience,
				resources: data.resources,
				cgpa: data.cgpa,
				clubPositions: data.clubPositions,
				ctc: data.ctc?.ctc,
				basePay: data.ctc?.basePay,
				stipend: data.stipend,
				otRounds: data.processStructure?.otRound,
				piRounds: data.processStructure?.piRound,
				startDate: data.processStructure?.startDate
					? new Date(data.processStructure.startDate)
							.toISOString()
							.split("T")[0]
					: undefined,

				endDate: data.processStructure?.endDate
					? new Date(data.processStructure.endDate).toISOString().split("T")[0]
					: undefined,
			});
		};

		loadSubmission();
	}, [isEditMode, data, reset]);

	const { createSubmission, loading: submissionLoading } =
		useCreateSubmission();

	const { editSubmission } = useUpdateSubmission();

	const onSubmit = async (data: SubmissionFormData) => {
		let res: boolean;

		if (isEditMode && submissionId) {
			res = await editSubmission(data, submissionId);
		} else {
			res = await createSubmission(data);
		}
		if (res) {
			navigate(`/profile/${user.id}`, {
				state: { submissionSaved: true },
			});
		}
	};

	if (isEditMode && isLoading) {
		return (
			<div className="h-full flex items-center justify-center">
				<Loader size={80} />
			</div>
		);
	}

	if (isEditMode && error) {
			navigate(`/error`);
	}

	return (
		<div className="h-full overflow-y-auto no-scrollbar">
			{submissionLoading && <Loader size={100} />}
			<ToastContainer newestOnTop />
			<div className="min-h-full px-4 py-6 flex justify-center">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full max-w-3xl rounded-2xl p-6 sm:p-8 space-y-10"
					style={{
						background: "var(--fore-bg)",
						boxShadow: "0 8px 24px var(--shadow-color)",
					}}
				>
					<div className="space-y-2">
						<h1 className="text-2xl sm:text-3xl font-semibold">
							{isEditMode ? "Edit Submission" : "Create Submission"}
						</h1>
						<p className="text-sm text-(--text-light)">
							Share your internship / placement experience
						</p>
					</div>
					<Section title="Company & Role">
						<TwoCol>
							<Field error={errors.company?.message}>
								<label htmlFor="company" className="field-label">
									Company
								</label>
								<select
									id="company"
									className="input"
									{...register("company")}
									disabled={companyLoading}
								>
									<option value="">
										{companyLoading ? "Loading companies..." : "Select company"}
									</option>
									{companies.map((company) => (
										<option key={company.id} value={company.id}>
											{company.name}
										</option>
									))}
								</select>
								{companyError && (
									<p className="text-sm text-red-400">
										Failed to load companies
									</p>
								)}
							</Field>

							<Field error={errors.domain?.message}>
								<label htmlFor="domain" className="field-label">
									Domain
								</label>
								<select
									id="domain"
									className="input"
									{...register("domain")}
									disabled={roleLoading}
								>
									<option value="">
										{roleLoading ? "Loading domains..." : "Select domain"}
									</option>
									{domains.map((domain) => (
										<option key={domain.id} value={domain.id}>
											{domain.domainName}
										</option>
									))}
								</select>
								{roleError && (
									<p className="text-sm text-red-400">Failed to load roles</p>
								)}
							</Field>
						</TwoCol>
					</Section>
					<Section title="Submission Type">
						<Field error={errors.type?.message}>
							<select className="input" {...register("type")}>
								<option value="">Select type</option>
								<option value="INTERN">INTERN</option>
								<option value="PLACED">PLACED</option>
								<option value="INTERN_TO_PPO">INTERN TO PPO</option>
							</select>
						</Field>
					</Section>
					<Section title="Role Description">
						<textarea
							className="textarea"
							{...register("domainDescription")}
							placeholder="Role Description"
						/>
					</Section>

					<Section title="Experience">
						<Field error={errors.experience?.message}>
							<Controller
								name="experience"
								control={control}
								render={({ field }) => (
									<TextEditor
										value={field.value || ""}
										onChange={field.onChange}
										theme={theme}
										placeholder="Describe your interview / internship experience in detail"
										size="medium"
									/>
								)}
							/>
						</Field>
					</Section>

					<Section title="Resources">
						<Controller
							name="resources"
							control={control}
							render={({ field }) => (
								<TextEditor
									value={field.value || ""}
									onChange={field.onChange}
									theme={theme}
									placeholder="Books, links, courses, or resources you used"
									size="small"
								/>
							)}
						/>
					</Section>

					<Section title="Academic">
						<TwoCol>
							<Field error={errors.cgpa?.message}>
								<input
									type="number"
									step="0.01"
									className="input"
									{...register("cgpa")}
									placeholder="CGPA"
								/>
							</Field>

							<input
								className="input"
								{...register("clubPositions")}
								placeholder="Club Positions"
							/>
						</TwoCol>
					</Section>

					<Section title="Compensation">
						<ThreeCol>
							<input
								type="number"
								className="input"
								{...register("ctc")}
								placeholder="CTC"
							/>
							<Field error={errors.basePay?.message}>
								<input
									type="number"
									className="input"
									{...register("basePay")}
									placeholder="Base Pay"
								/>
							</Field>
							<input
								type="number"
								className="input"
								{...register("stipend")}
								placeholder="Stipend"
							/>
						</ThreeCol>
					</Section>

					<Section title="Interview Process">
						<TwoCol>
							<input
								type="number"
								className="input"
								{...register("otRounds")}
								placeholder="OT Rounds"
							/>
							<input
								type="number"
								className="input"
								{...register("piRounds")}
								placeholder="PI Rounds"
							/>
						</TwoCol>
					</Section>

					<Section title="Duration">
						<TwoCol>
							<Field error={errors.startDate?.message}>
								<input
									type="date"
									className="input"
									{...register("startDate")}
								/>
							</Field>
							<Field error={errors.endDate?.message}>
								<input type="date" className="input" {...register("endDate")} />
							</Field>
						</TwoCol>
					</Section>

					<button
						type="submit"
						disabled={submissionLoading}
						className={`w-full py-3 rounded-xl font-medium transition-all
                       ${submissionLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} active:scale-95`}
						style={{ background: "var(--accent)", color: "#000" }}
					>
						{submissionLoading ? "Submitting..." : "Submit"}
					</button>
				</form>
			</div>
		</div>
	);
};

/* ================= UI HELPERS ================= */

function Field({
	children,
	error,
}: {
	children: React.ReactNode;
	error?: string;
}) {
	return (
		<div className="space-y-1">
			{children}
			{error && <p className="text-sm text-red-400">{error}</p>}
		</div>
	);
}

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="space-y-4">
			<h2 className="text-lg font-medium">{title}</h2>
			{children}
		</section>
	);
}

function TwoCol({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
	);
}

function ThreeCol({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{children}</div>
	);
}

export default SubmissionForm;
