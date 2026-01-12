export function resizeImageToMax256(file: File): Promise<File> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const reader = new FileReader();

		reader.onload = () => {
			if (typeof reader.result !== "string") return reject("Invalid file");
			img.src = reader.result;
		};

		img.onerror = () => reject("Image load failed");

		img.onload = () => {
			const MAX_SIZE = 256;
			const { width, height } = img;

			// scale (never upscale)
			const scale = Math.min(1, MAX_SIZE / Math.max(width, height));
			const newWidth = Math.round(width * scale);
			const newHeight = Math.round(height * scale);

			const canvas = document.createElement("canvas");
			canvas.width = MAX_SIZE;
			canvas.height = MAX_SIZE;

			const ctx = canvas.getContext("2d");
			if (!ctx) return reject("Canvas not supported");

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const x = (MAX_SIZE - newWidth) / 2;
			const y = (MAX_SIZE - newHeight) / 2;

			ctx.drawImage(img, x, y, newWidth, newHeight);

			canvas.toBlob((blob) => {
				if (!blob) return reject("Resize failed");
				resolve(
					new File([blob], file.name.replace(/\.\w+$/, ".png"), {
						type: "image/png",
						lastModified: Date.now(),
					}),
				);
			}, "image/png");
		};

		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
