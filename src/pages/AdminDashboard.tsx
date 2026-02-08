import React, { type ChangeEvent, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import type { GetAllRequestResponseDto } from "../../web-client/src/generated";
import useAddCompany from "../hooks/useAddCompany";
import useDeleteRequest from "../hooks/useDeleteRequest";
import useDeleteSubmissionAdmin from "../hooks/useDeleteSubmissionAdmin";
import useGetAllRequests from "../hooks/useGetAllRequests";

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
	const requestsControllerRef = useRef<AbortController | null>(null);
	const [requests, setRequests] = useState<GetAllRequestResponseDto[]>([]);
	const [loadingRequests, setLoadingRequests] = useState(false);
	const { getAllRequests, requestError } = useGetAllRequests();
	const { addCompany } = useAddCompany();
	const { deleteSubmissionAdmin, submissionError } = useDeleteSubmissionAdmin();
	const deleteRequestControllerRef = useRef<AbortController | null>(null);
	const { deleteRequest, error: deleteRequestError } = useDeleteRequest();

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInputs((prev) => ({ ...prev, [name]: value }));
	};

	const handleAddCompany = async () => {
		if (!inputs.companyName || !inputs.companyUrl) {
			alert("Please fill in both fields");
			return;
		}
		addCompanyControllerRef.current?.abort();
		const controller = new AbortController();
		addCompanyControllerRef.current = controller;
		try {
			await addCompany(
				inputs.companyName,
				inputs.companyUrl,
				inputs.companyDescription,
				controller,
			);

			toast.success("Company added.");
			setLastSubmitted(inputs);
			setInputs({ companyName: "", companyDescription: "", companyUrl: "" });
			setDeleteMessage(null);
		} catch (error: any) {
			console.log(error);
			if (error?.name === "AbortError") return;

			toast.error(error?.message || "Cannot add company");
		}

		setLastSubmitted(inputs);
		setInputs({ companyName: "", companyDescription: "", companyUrl: "" });
		setDeleteMessage(null);
	};

	useEffect(() => {
		requestsControllerRef.current?.abort();
		const controller = new AbortController();
		requestsControllerRef.current = controller;
		setLoadingRequests(true);
		getAllRequests(controller)
			.then((res) => {
				if (res) setRequests(res);
			})
			.finally(() => setLoadingRequests(false));
		return () => controller.abort();
	}, [getAllRequests]);

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
			toast.success("Submission deleted.");
		} else {
			toast.error(String(submissionError));
		}
		setDeleteMessage(`Submission #${deleteId} has been deleted.`);
		setDeleteId("");
		setLastSubmitted(null);
	};

	const handleDeleteRequest = async (requestId: number | undefined) => {
		if (requestId === undefined) return;
		deleteRequestControllerRef.current?.abort();
		const controller = new AbortController();
		deleteRequestControllerRef.current = controller;
		await deleteRequest(requestId, controller);
		if (deleteRequestError === null) {
			toast.success("Request deleted.");
		} else {
			toast.error("Something went wrong.");
		}
	};

	return (
		<div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-gray-100 font-sans p-4">
			<ToastContainer newestOnTop />
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl h-[90vh] flex flex-col">
				<div className="flex flex-col md:flex-row gap-8 h-full overflow-hidden">
					<div className="md:w-1/3 space-y-8 shrink-0">
						<section>
							<h2 className="text-2xl font-bold text-black mb-4 text-center md:text-left">
								Add Company
							</h2>
							<div className="space-y-4">
								<div className="flex flex-col space-y-1">
									<label
										htmlFor="companyName"
										className="text-sm font-medium text-black"
									>
										Company Name
									</label>
									<input
										type="text"
										name="companyName"
										value={inputs.companyName}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
									/>
								</div>
								<div className="flex flex-col space-y-1">
									<label
										htmlFor="companyDescription"
										className="text-sm font-medium text-black"
									>
										Description
									</label>
									<input
										type="text"
										name="companyDescription"
										value={inputs.companyDescription}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
									/>
								</div>
								<div className="flex flex-col space-y-1">
									<label
										htmlFor="companyUrl"
										className="text-sm font-medium text-black"
									>
										URL
									</label>
									<input
										type="text"
										name="companyUrl"
										value={inputs.companyUrl}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
									/>
								</div>
								<button
									type="button"
									onClick={handleAddCompany}
									className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
								>
									Submit Company
								</button>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-bold text-black mb-4">
								Delete Submission
							</h2>
							<div className="flex gap-2">
								<input
									type="text"
									value={deleteId}
									onChange={(e) => setDeleteId(e.target.value)}
									placeholder="ID"
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 text-black"
								/>
								<button
									type="button"
									onClick={handleDeleteSubmission}
									className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition"
								>
									Delete
								</button>
							</div>
						</section>
					</div>
					<div className="md:w-2/3 flex flex-col h-full overflow-hidden">
						<h2 className="text-xl font-bold text-black mb-3">
							Pending Requests
						</h2>
						<div className="flex-1 overflow-y-auto border rounded-lg bg-gray-50 relative">
							{loadingRequests ? (
								<div className="p-10 text-center text-gray-600">Loading...</div>
							) : requests.length === 0 ? (
								<div className="p-10 text-center text-gray-500 italic">
									No pending requests
								</div>
							) : (
								<table className="min-w-full border-collapse">
									<thead className="sticky top-0 bg-white shadow-sm z-10">
										<tr className="text-left text-gray-700 border-b">
											<th className="px-4 py-3 font-semibold">User ID</th>
											<th className="px-4 py-3 font-semibold">Company Name</th>
											<th className="px-4 py-3 font-semibold text-center">
												Action
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{requests.map((req) => (
											<tr
												key={req.userName}
												className="hover:bg-white transition-colors"
											>
												<td className="px-4 py-3 text-sm text-gray-600">
													{req.userName}
												</td>
												<td className="px-4 py-3 text-sm font-medium text-black">
													{req.companyName}
												</td>
												<td className="px-4 py-3 text-center">
													<button
														type="button"
														onClick={() => handleDeleteRequest(req.id)}
														className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 py-1 px-4 rounded-md text-sm font-bold transition"
													>
														Delete
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
