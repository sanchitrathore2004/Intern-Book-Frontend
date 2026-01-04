import type React from "react";

export interface UploadModalProps {
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	callFunc: (file: File) => void;
}
