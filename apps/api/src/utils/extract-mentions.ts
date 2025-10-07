/**
 * Utility to extract username mentions from post content
 * Detects @username patterns in text content
 */

export const extractMentions = (content: string): string[] => {
	const mentionRegex = /@(\w+)/g;
	const mentions: string[] = [];
	let match: RegExpExecArray | null = mentionRegex.exec(content);

	while (match !== null) {
		const username = match[1];
		if (username) {
			mentions.push(username);
		}
		match = mentionRegex.exec(content);
	}

	return mentions;
};

/**
 * Process mentions from post content
 * TODO: Implement mention notification system
 * TODO: Add mention validation (check if users exist)
 * TODO: Create mention records in database
 */
export const processMentions = (content: string): string[] => {
	const mentions = extractMentions(content);

	// TODO: Add validation to check if mentioned users exist
	// TODO: Send notifications to mentioned users
	// TODO: Store mention relationships in database

	return mentions;
};
