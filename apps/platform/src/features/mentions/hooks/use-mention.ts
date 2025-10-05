import { useState } from "react";

type CursorCoordinates = {
	top: number;
	left: number;
};

export const useMention = () => {
	const [showMentionDropdown, setShowMentionDropdown] = useState(false);
	const [mentionSearch, setMentionSearch] = useState("");
	const [cursorPosition, setCursorPosition] = useState(0);
	const [cursorCoordinates, setCursorCoordinates] =
		useState<CursorCoordinates | null>(null);

	const getCursorCoordinates = (
		textarea: HTMLTextAreaElement,
		position: number,
	): CursorCoordinates => {
		const div = document.createElement("div");
		const span = document.createElement("span");
		const computed = window.getComputedStyle(textarea);

		div.style.position = "absolute";
		div.style.visibility = "hidden";
		div.style.whiteSpace = "pre-wrap";
		div.style.wordWrap = "break-word";
		div.style.font = computed.font;
		div.style.padding = computed.padding;
		div.style.width = computed.width;
		div.style.lineHeight = computed.lineHeight;

		const textContent = textarea.value.substring(0, position);
		div.textContent = textContent;

		span.textContent = textarea.value.substring(position) || ".";
		div.appendChild(span);

		document.body.appendChild(div);

		const coordinates = {
			top: span.offsetTop,
			left: span.offsetLeft,
		};

		document.body.removeChild(div);
		return coordinates;
	};

	const handleMentionSelect = (
		username: string,
		content: string,
		onContentChange: (content: string) => void,
	) => {
		const beforeMention = content.slice(0, cursorPosition);
		const afterMention = content.slice(cursorPosition);

		const lastAtIndex = beforeMention.lastIndexOf("@");
		const newContent =
			`${beforeMention.slice(0, lastAtIndex)}@${username} ${afterMention}`;

		onContentChange(newContent);
		setShowMentionDropdown(false);
		setMentionSearch("");
		setCursorCoordinates(null);
	};

	const handleContentChange = (
		value: string,
		cursorPos: number,
		textarea: HTMLTextAreaElement | null,
		onContentChange: (content: string) => void,
	) => {
		onContentChange(value);
		setCursorPosition(cursorPos);

		const textBeforeCursor = value.slice(0, cursorPos);
		const lastAtIndex = textBeforeCursor.lastIndexOf("@");

		if (lastAtIndex !== -1) {
			const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
			const hasSpaceAfterAt = textAfterAt.includes(" ");

			if (!hasSpaceAfterAt) {
				if (textarea) {
					const coords = getCursorCoordinates(textarea, cursorPos);
					setCursorCoordinates(coords);
				}
				setShowMentionDropdown(true);
				setMentionSearch(textAfterAt);
			} else {
				setShowMentionDropdown(false);
				setMentionSearch("");
				setCursorCoordinates(null);
			}
		} else {
			setShowMentionDropdown(false);
			setMentionSearch("");
			setCursorCoordinates(null);
		}
	};

	return {
		showMentionDropdown,
		mentionSearch,
		cursorPosition,
		cursorCoordinates,
		handleMentionSelect,
		handleContentChange,
		setShowMentionDropdown,
		setCursorCoordinates,
	};
};
