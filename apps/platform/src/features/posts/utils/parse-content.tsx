import type { JSX } from "react";
import { Link } from "react-router";
import { LinkPreviewCard } from "../../link-preview/components/link-preview-card";

export const parseContent = (content: string) => {
	const parts: (string | JSX.Element)[] = [];
	const links: string[] = [];

	// Create a combined regex to match both mentions and URLs
	const combinedRegex = /(@\w+)|(https?:\/\/[^\s]+)/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null = combinedRegex.exec(content);

	while (match !== null) {
		const matchStart = match.index;
		const matchEnd = combinedRegex.lastIndex;
		const matchedText = match[0];

		// Add text before current match
		if (matchStart > lastIndex) {
			parts.push(content.slice(lastIndex, matchStart));
		}

		// Check if it's a mention or URL
		if (matchedText?.startsWith("@")) {
			const username = matchedText.slice(1);
			parts.push(
				<Link
					key={`mention-${matchStart}-${username}`}
					to={`/profile/${username}`}
					className="text-blue-600 hover:underline hover:text-blue-700 font-medium"
					onClick={(e) => e.stopPropagation()}
				>
					@{username}
				</Link>,
			);
		} else if (matchedText?.startsWith("http")) {
			// Store the URL for preview cards at the end
			links.push(matchedText);
			// Add the URL as clickable link in text
			parts.push(
				<a
					key={`link-${matchStart}`}
					href={matchedText}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:underline break-all"
					onClick={(e) => e.stopPropagation()}
				>
					{matchedText}
				</a>,
			);
		}

		lastIndex = matchEnd;
		match = combinedRegex.exec(content);
	}

	// Add remaining text
	if (lastIndex < content.length) {
		parts.push(content.slice(lastIndex));
	}

	// Add link preview cards at the end
	if (links.length > 0) {
		for (const url of links) {
			parts.push(<LinkPreviewCard key={`preview-${url}`} url={url} />);
		}
	}

	return parts.length > 0 ? parts : content;
};
