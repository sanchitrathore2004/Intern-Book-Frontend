import React, { type ChangeEvent, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import useAddCompany from "../hooks/useAddCompany";
import useDeleteSubmissionAdmin from "../hooks/useDeleteSubmissionAdmin";

interface CompanyData {
	companyName: string;
	companyDescription: string;
	companyUrl: string;
}

const AdminDashboard: React.FC = () => {
	const [inputs, setInputs] = useState<CompanyData>({
		companyName: "",
		companyDescription: "",
		companyUrl: "",
	});
	const [lastSubmitted, setLastSubmitted] = useState<CompanyData | null>(null);

	const [deleteId, setDeleteId] = useState<string>("");
	const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
	const addCompanyControllerRef = useRef<AbortController | null>(null);
	const deleteSubmissionControllerRef = useRef<AbortController | null>(null);
	const { addCompany, companyError } = useAddCompany();
	const { deleteSubmissionAdmin, submissionError } = useDeleteSubmissionAdmin();

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInputs((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleAddCompany = async () => {
		if (!inputs.companyName || !inputs.companyUrl) {
			alert("Please fill in both fields");
			return;
		}
		addCompanyControllerRef.current?.abort();
		const controller = new AbortController();
		addCompanyControllerRef.current = controller;
		await addCompany(
			inputs.companyName,
			inputs.companyUrl,
			inputs.companyDescription,
			controller,
		);
		if (companyError === null) {
			toast.success("Company added.");
		} else {
			toast.error(companyError.toString);
		}
		setLastSubmitted(inputs);
		setInputs({ companyName: "", companyDescription: "", companyUrl: "" });
		setDeleteMessage(null);
	};

	const handleDeleteSubmission = async () => {
		if (!deleteId) {
			alert("Please enter a Submission ID");
			return;
		}
		deleteSubmissionControllerRef.current?.abort();
		const controller = new AbortController();
		deleteSubmissionControllerRef.current = controller;
		await deleteSubmissionAdmin(deleteId, controller);
		if (submissionError === null) {
			toast.success("submission deleted.");
		} else {
			toast.error(submissionError.toString);
		}
		setDeleteMessage(`Submission #${deleteId} has been deleted.`);
		setDeleteId("");
		setLastSubmitted(null);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
			<ToastContainer newestOnTop />
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold text-center text-black mb-6">
					Add Company
				</h2>

				<div className="space-y-4">
					{/* Company Name */}
					<div className="flex flex-col space-y-2">
						<label
							htmlFor="companyName"
							className="text-sm font-medium text-black"
						>
							Company Name
						</label>
						<input
							id="companyName"
							type="text"
							name="companyName"
							value={inputs.companyName}
							onChange={handleInputChange}
							placeholder="e.g. Acme Corp"
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black"
						/>
					</div>

					{/* Company Description */}
					<div className="flex flex-col space-y-2">
						<label
							htmlFor="companyDescription"
							className="text-sm font-medium text-black"
						>
							Company Description
						</label>
						<input
							id="companyDescription"
							type="text"
							name="companyDescription"
							value={inputs.companyDescription}
							onChange={handleInputChange}
							placeholder="e.g. A tech company..."
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black"
						/>
					</div>

					{/* Company URL */}
					<div className="flex flex-col space-y-2">
						<label
							htmlFor="companyUrl"
							className="text-sm font-medium text-black"
						>
							Company URL
						</label>
						<input
							id="companyUrl"
							type="text"
							name="companyUrl"
							value={inputs.companyUrl}
							onChange={handleInputChange}
							placeholder="https://example.com"
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black"
						/>
					</div>

					<button
						type="button"
						onClick={handleAddCompany}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 shadow-sm mt-4"
					>
						Submit Company
					</button>
				</div>

				{lastSubmitted && (
					<div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-black text-center text-sm">
						Added: <strong>{lastSubmitted.companyName}</strong>
					</div>
				)}
				<hr className="my-8 border-gray-200" />

				{/* DELETE SECTION */}
				<h2 className="text-xl font-bold text-center text-black mb-4">
					Delete Submission
				</h2>

				<div className="space-y-4">
					<div className="flex flex-col space-y-2">
						<label
							htmlFor="deleteId"
							className="text-sm font-medium text-black"
						>
							Submission ID
						</label>
						<div className="flex gap-2">
							<input
								id="deleteId"
								type="text"
								value={deleteId}
								onChange={(e) => setDeleteId(e.target.value)}
								placeholder="ID to delete"
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition text-black"
							/>
							<button
								type="button"
								onClick={handleDeleteSubmission}
								className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 shadow-sm whitespace-nowrap"
							>
								Delete
							</button>
						</div>
					</div>
				</div>

				{deleteMessage && (
					<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-black text-center text-sm">
						{deleteMessage}
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminDashboard;
