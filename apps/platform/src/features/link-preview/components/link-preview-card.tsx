import { useLinkPreview } from "../hooks/use-link-preview";

interface LinkPreviewCardProps {
	url: string;
}

export const LinkPreviewCard = ({ url }: LinkPreviewCardProps) => {
	const { preview, isLoading } = useLinkPreview(url);

	if (isLoading) {
		return (
			<div className="border border-gray-200 rounded-lg p-4 my-2 animate-pulse">
				<div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
				<div className="h-3 bg-gray-200 rounded w-full mb-2" />
				<div className="h-3 bg-gray-200 rounded w-2/3" />
			</div>
		);
	}

	if (!preview) {
		return (
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="text-blue-600 hover:underline break-all"
			>
				{url}
			</a>
		);
	}

	return (
		<a
			href={preview.url}
			target="_blank"
			rel="noopener noreferrer"
			className="block border border-gray-200 rounded-lg overflow-hidden my-2 hover:border-gray-300 transition-colors"
			onClick={(e) => e.stopPropagation()}
		>
			{preview.image && (
				<div className="w-full h-48 bg-gray-100 overflow-hidden">
					<img
						src={preview.image}
						alt={preview.title}
						className="w-full h-full object-cover"
					/>
				</div>
			)}
			<div className="p-4">
				{preview.title && (
					<h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
						{preview.title}
					</h3>
				)}
				{preview.description && (
					<p className="text-sm text-gray-600 line-clamp-2">
						{preview.description}
					</p>
				)}
				<p className="text-xs text-gray-500 mt-2 truncate">{preview.url}</p>
			</div>
		</a>
	);
};
