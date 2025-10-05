interface PostMediaProps {
	media: {
		id: string;
		url: string;
		type: "IMAGE" | "VIDEO" | "DOCUMENT";
	}[];
}

export const PostMedia = ({ media }: PostMediaProps) => {
	if (!media || media.length === 0) return null;

	const imageMedia = media.filter((m) => m.type === "IMAGE");

	if (imageMedia.length === 0) return null;

	return (
		<div className="mt-3 mb-3">
			{imageMedia.length === 1 && (
				<div className="rounded-lg overflow-hidden border border-border">
					<img
						src={imageMedia?.[0]?.url}
						alt="Post media"
						className="w-full h-auto max-h-96 object-cover"
					/>
				</div>
			)}

			{imageMedia.length === 2 && (
				<div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
					{imageMedia.map((item) => (
						<div
							key={item.id}
							className="border border-border rounded-lg overflow-hidden"
						>
							<img
								src={item.url}
								alt="Post media"
								className="w-full h-48 object-cover"
							/>
						</div>
					))}
				</div>
			)}

			{imageMedia.length === 3 && (
				<div className="grid grid-cols-2 gap-2">
					<div className="col-span-2 border border-border rounded-lg overflow-hidden">
						<img
							src={imageMedia?.[0]?.url}
							alt="Post media"
							className="w-full h-48 object-cover"
						/>
					</div>
					{imageMedia.slice(1).map((item) => (
						<div
							key={item.id}
							className="border border-border rounded-lg overflow-hidden"
						>
							<img
								src={item.url}
								alt="Post media"
								className="w-full h-32 object-cover"
							/>
						</div>
					))}
				</div>
			)}

			{imageMedia.length >= 4 && (
				<div className="grid grid-cols-2 gap-2">
					{imageMedia.slice(0, 4).map((item, index) => (
						<div
							key={item.id}
							className="border border-border rounded-lg overflow-hidden relative"
						>
							<img
								src={item.url}
								alt="Post media"
								className="w-full h-48 object-cover"
							/>
							{index === 3 && imageMedia.length > 4 && (
								<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
									<span className="text-white text-2xl font-semibold">
										+{imageMedia.length - 4}
									</span>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
