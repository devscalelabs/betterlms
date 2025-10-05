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
