import type { JSX } from "react";
import { Link } from "react-router";

export const parseContent = (content: string) => {
	const mentionRegex = /@(\w+)/g;
	const parts: (string | JSX.Element)[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null = mentionRegex.exec(content);

	while (match !== null) {
		const username = match[1];
		const matchStart = match.index;
		const matchEnd = mentionRegex.lastIndex;

		// Add text before mention
		if (matchStart > lastIndex) {
			parts.push(content.slice(lastIndex, matchStart));
		}

		// Add mention as link
		if (username) {
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
		}

		lastIndex = matchEnd;
		match = mentionRegex.exec(content);
	}

	// Add remaining text
	if (lastIndex < content.length) {
		parts.push(content.slice(lastIndex));
	}

	return parts.length > 0 ? parts : content;
};
