import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import type { UploadModalProps } from "../interfaces/UploadModalProps";

function UploadModal(props: UploadModalProps) {
	const {
		getRootProps,
		getInputProps,
		isDragActive,
		fileRejections,
		acceptedFiles,
	} = useDropzone({
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".webp"],
		},
		maxFiles: 1,
		maxSize: 2 * 1024 * 1024, // 2 MB max size allowed
		onDrop: (files) => {
			console.log("Selected file:", files[0]);
		},
	});

	const handleClose = () => {
		props.setIsModalOpen(false);
	};

	const handleUploadClick = () => {
		if (acceptedFiles.length === 0) {
			toast.error("Upload an image.");
			return;
		}
		props.callFunc(acceptedFiles[0]);
		props.setIsModalOpen(false);
	};

	return (
		// biome-ignore lint:a11y/useKeyWithClickEvents
		<div
			role="application"
			onClick={handleClose}
			className="fixed inset-0 bg-black/70 z-100 flex items-center justify-center"
		>
			<button
				type="button"
				onClick={handleClose}
				className="absolute top-[1.3vmax] right-[2vmax] text-[2vmax] font-bold cursor-pointer"
			>
				X
			</button>
			{/* biome-ignore lint:a11y/useKeyWithClickEvents */}
			<div
				role="dialog"
				onClick={(e) => e.stopPropagation()}
				className="relative w-[40vmax] h-[30vmax] rounded-[1vmax] bg-(--bg) border-2 border-dashed border-(--border-color) flex flex-col items-center"
			>
				<div
					{...getRootProps()}
					className={`
            w-full h-[90%] m-[1vmax] rounded-[1vmax]
            flex flex-col items-center justify-center
            cursor-pointer transition
          `}
				>
					<input {...getInputProps()} />
					{!acceptedFiles.length && (
						<>
							<p className="text-(--text-heading) text-[1.2vmax] font-semibold">
								{isDragActive ? "Drop image here" : "Drag & drop image here"}
							</p>
							<p className="text-(--text-muted) text-[0.9vmax] mt-[0.5vmax]">
								or click to select (PNG, JPG, WEBP · max 2MB)
							</p>
						</>
					)}
					{acceptedFiles.length > 0 && (
						<img
							src={URL.createObjectURL(acceptedFiles[0])}
							alt="Preview"
							className="max-h-full max-w-full rounded-[0.8vmax] object-contain"
						/>
					)}
					{fileRejections.length > 0 && (
						<p className="text-red-500 text-[0.9vmax] mt-[0.5vmax]">
							Invalid file type or file too large
						</p>
					)}
				</div>
				<button
					type="button"
					onClick={handleUploadClick}
					className="absolute w-[50%] h-[10%] -bottom-7 bg-(--accent) rounded-[1vmax] cursor-pointer flex justify-center items-center text-(--bg) text-[1.2vmax] font-bold"
				>
					Upload
				</button>
			</div>
		</div>
	);
}

export default UploadModal;
