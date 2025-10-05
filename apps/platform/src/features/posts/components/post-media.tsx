import { Dialog, DialogContent } from "@betterlms/ui";
import { useState } from "react";

interface PostMediaProps {
	media: {
		id: string;
		url: string;
		type: "IMAGE" | "VIDEO" | "DOCUMENT";
	}[];
}

export const PostMedia = ({ media }: PostMediaProps) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	if (!media || media.length === 0) return null;

	const imageMedia = media.filter((m) => m.type === "IMAGE");

	if (imageMedia.length === 0) return null;

	const handleImageClick = (url: string) => {
		setSelectedImage(url);
		setIsOpen(true);
	};

	const handleCloseDialog = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			// Delay clearing the image to allow dialog close animation to complete
			setTimeout(() => {
				setSelectedImage(null);
			}, 200);
		}
	};

	return (
		<>
			<div className="mt-3 mb-3">
				{imageMedia.length === 1 && imageMedia[0] && (
					<button
						type="button"
						className="rounded-lg overflow-hidden border border-border cursor-pointer w-full text-left p-0"
						onClick={() => {
							if (imageMedia[0]) {
								handleImageClick(imageMedia[0].url);
							}
						}}
					>
						<img
							src={imageMedia[0].url}
							alt="Post media"
							className="w-full h-auto max-h-96 object-cover hover:opacity-90 transition-opacity"
						/>
					</button>
				)}

				{imageMedia.length === 2 && (
					<div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
						{imageMedia.map((item) => (
							<button
								key={item.id}
								type="button"
								className="border border-border rounded-lg overflow-hidden cursor-pointer p-0"
								onClick={() => handleImageClick(item.url)}
							>
								<img
									src={item.url}
									alt="Post media"
									className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
								/>
							</button>
						))}
					</div>
				)}

				{imageMedia.length === 3 && imageMedia[0] && (
					<div className="grid grid-cols-2 gap-2">
						<button
							type="button"
							className="col-span-2 border border-border rounded-lg overflow-hidden cursor-pointer p-0"
							onClick={() => {
								if (imageMedia[0]) {
									handleImageClick(imageMedia[0].url);
								}
							}}
						>
							<img
								src={imageMedia[0].url}
								alt="Post media"
								className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
							/>
						</button>
						{imageMedia.slice(1).map((item) => (
							<button
								key={item.id}
								type="button"
								className="border border-border rounded-lg overflow-hidden cursor-pointer p-0"
								onClick={() => handleImageClick(item.url)}
							>
								<img
									src={item.url}
									alt="Post media"
									className="w-full h-32 object-cover hover:opacity-90 transition-opacity"
								/>
							</button>
						))}
					</div>
				)}

				{imageMedia.length >= 4 && (
					<div className="grid grid-cols-2 gap-2">
						{imageMedia.slice(0, 4).map((item, index) => (
							<button
								key={item.id}
								type="button"
								className="border border-border rounded-lg overflow-hidden relative cursor-pointer p-0"
								onClick={() => handleImageClick(item.url)}
							>
								<img
									src={item.url}
									alt="Post media"
									className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
								/>
								{index === 3 && imageMedia.length > 4 && (
									<div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
										<span className="text-white text-2xl font-semibold">
											+{imageMedia.length - 4}
										</span>
									</div>
								)}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Fullscreen Image Dialog */}
			<Dialog open={isOpen} onOpenChange={handleCloseDialog}>
				<DialogContent className="!max-w-[95vw] !w-auto h-[90vh] p-0 overflow-hidden">
					<div className="h-full flex items-center justify-center">
						{selectedImage && (
							<img
								src={selectedImage}
								alt="Fullscreen preview"
								className="max-w-[95vw] max-h-full object-contain"
							/>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
