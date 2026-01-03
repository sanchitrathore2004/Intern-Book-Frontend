// src/components/ConfirmChangeToast.tsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { CompanyControllerApi } from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";
import { showError, showSuccess } from "../utils/toast";

interface Props {
	companyId: number;
	currentCompanyName: string; // the company already set as dream
	newCompanyName?: string; // optional, to show in message
	onDone?: () => void; // optional callback after success
}

export default function ConfirmChangeToast({
	companyId,
	currentCompanyName,
	newCompanyName,
	onDone,
}: Props) {
	const [loading, setLoading] = useState(false);

	const handleConfirm = async () => {
		setLoading(true);
		try {
			const api = new CompanyControllerApi(apiConfig);
			await api.updateDreamCompany({ companyId });
			toast.dismiss();
			showSuccess(
				`Dream company changed to ${newCompanyName ?? "selected company"}`,
			);
			if (onDone) onDone();
		} catch (err) {
			console.error(err);
			showError("Could not change dream company. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			<div>
				You already have a dream company <strong>{currentCompanyName}</strong>.
				Change it to <strong>{newCompanyName ?? "this company"}</strong>?
			</div>
			<div style={{ display: "flex", gap: 8, marginTop: 6 }}>
				<button
					type="button"
					onClick={() => toast.dismiss()}
					className="px-3 py-1 rounded bg-(--line-color)"
					disabled={loading}
				>
					No
				</button>

				<button
					type="button"
					onClick={handleConfirm}
					className="px-3 py-1 rounded bg-(--accent) text-(--bg)"
					disabled={loading}
				>
					{loading ? "Changing..." : "Yes, change"}
				</button>
			</div>
		</div>
	);
}
