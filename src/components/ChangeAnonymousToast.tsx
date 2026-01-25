import { useState } from "react";
import { toast } from "react-toastify";
import { UserControllerApi } from "../../web-client/src/generated";
import { apiConfig } from "../utils/apiConfig";
import { showError, showSuccess } from "../utils/toast";

interface Props {
	isAnonymous: boolean;
	onDone: () => void;
}

const ChangeAnonymousToast = (props: Props) => {
	const [loading, setLoading] = useState(false);

	const handleConfirm = async () => {
		setLoading(true);
		try {
			const api = new UserControllerApi(apiConfig);
			await api.toggleAnonymous();
			toast.dismiss();
			showSuccess(
				`Profile changed to ${props.isAnonymous ? "Public" : "Anonymous"}`,
			);
			props.onDone();
		} catch (err) {
			console.error(err);
			showError("Could not change profile visibility. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			<div>
				You are currently in{" "}
				<strong>{props.isAnonymous ? "Anonymous" : "Public"} mode</strong>.
				Change it to{" "}
				<strong>{props.isAnonymous ? "Public" : "Anonymous"}</strong>?
			</div>
			<div style={{ display: "flex", gap: 8, marginTop: 6 }}>
				<button
					type="button"
					onClick={() => toast.dismiss()}
					className="px-3 py-1 rounded bg-(--line-color) transition-all active:scale-95 cursor-pointer hover:bg-(--fore-bg)"
					disabled={loading}
				>
					No
				</button>

				<button
					type="button"
					onClick={handleConfirm}
					className="px-3 py-1 rounded bg-(--accent) text-(--bg) transition-all active:scale-95 cursor-pointer hover:bg-(--accent-hover)"
					disabled={loading}
				>
					{loading ? "Changing..." : "Yes, change"}
				</button>
			</div>
		</div>
	);
};

export default ChangeAnonymousToast;
