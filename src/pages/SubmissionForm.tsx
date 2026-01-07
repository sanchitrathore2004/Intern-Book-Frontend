import "../index.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loader from "../components/Loader";
import UserContext from "../contexts/UserContext";
import useCreateSubmission from "../hooks/useCreateSubmission";
import useGetAllCompany from "../hooks/useGetAllCompany";
import useGetAllRoles from "../hooks/useGetAllRoles";
import type { SubmissionFormData } from "../interfaces/submissionSchema";
import { submissionSchema } from "../interfaces/submissionSchema";

const SubmissionForm = () => {
	const navigate = useNavigate();
	const { user } = useContext(UserContext);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(submissionSchema),
	});

	const {
		companies,
		loading: companyLoading,
		error: companyError,
		fetchAllCompany,
	} = useGetAllCompany();

	const {
		roles,
		loading: roleLoading,
		error: roleError,
		fetchAllRoles,
	} = useGetAllRoles();

	const { createSubmission, loading: submissionLoading } =
		useCreateSubmission();

	useEffect(() => {
		fetchAllCompany();
		fetchAllRoles();
	}, [fetchAllCompany, fetchAllRoles]);

	const onSubmit = async (data: SubmissionFormData) => {
		const res = await createSubmission(data);
		if (res) {
			navigate(`/profile/${user.id}`, { state: { submissionSaved: true } });
		}
	};

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
							Create Submission
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

							<Field error={errors.role?.message}>
								<label htmlFor="role" className="field-label">
									Role
								</label>
								<select
									id="role"
									className="input"
									{...register("role")}
									disabled={roleLoading}
								>
									<option value="">
										{roleLoading ? "Loading roles..." : "Select role"}
									</option>
									{roles.map((role) => (
										<option key={role.id} value={role.id}>
											{role.name}
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

					<Section title="Experience">
						<Field error={errors.experience?.message}>
							<textarea
								className="textarea min-h-40"
								{...register("experience")}
								placeholder="Write your detailed experience"
							/>
						</Field>
					</Section>

					<Section title="Insights">
						<textarea
							className="textarea"
							{...register("benefits")}
							placeholder="Benefits"
						/>
						<textarea
							className="textarea"
							{...register("mistakes")}
							placeholder="Mistakes"
						/>
						<textarea
							className="textarea"
							{...register("resources")}
							placeholder="Resources"
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
