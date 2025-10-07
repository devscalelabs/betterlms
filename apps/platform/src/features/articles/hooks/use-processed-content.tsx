import type { ReactElement } from "react";
import { useMemo } from "react";
import { CodeBlock } from "@/components/code-block";

interface ProcessedContentProps {
	content: string;
}

export const useProcessedContent = ({ content }: ProcessedContentProps) => {
	const processedContent = useMemo(() => {
		// Regular expression to match HTML code blocks
		// Matches: <pre><code class="language-xxx">code</code></pre> or <pre><code>code</code></pre>
		const htmlCodeBlockRegex =
			/<pre><code(?:\s+class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g;

		const parts: (string | ReactElement)[] = [];
		let lastIndex = 0;
		let key = 0;

		let match: RegExpExecArray | null;
		// biome-ignore lint/suspicious/noAssignInExpressions: This is a standard pattern for regex.exec()
		while ((match = htmlCodeBlockRegex.exec(content)) !== null) {
			const [fullMatch, language, code] = match;
			const matchStart = match.index;
			const matchEnd = matchStart + fullMatch.length;

			// Add text before the code block
			if (matchStart > lastIndex) {
				const textBefore = content.slice(lastIndex, matchStart);
				if (textBefore.trim()) {
					parts.push(
						<div
							key={`html-${key++}`}
							// biome-ignore lint/security/noDangerouslySetInnerHtml: This is intentional for rendering article HTML content
							dangerouslySetInnerHTML={{ __html: textBefore }}
						/>,
					);
				}
			}

			// Add the code block component
			if (code) {
				// Decode HTML entities in the code
				const decodedCode = code
					.replace(/&lt;/g, "<")
					.replace(/&gt;/g, ">")
					.replace(/&amp;/g, "&")
					.replace(/&quot;/g, '"')
					.replace(/&#x27;/g, "'")
					.replace(/&#x2F;/g, "/");

				parts.push(
					<CodeBlock
						key={`code-${key++}`}
						code={decodedCode.trim()}
						language={language}
						className="my-4"
					/>,
				);
			}

			lastIndex = matchEnd;
		}

		// Add remaining text after the last code block
		if (lastIndex < content.length) {
			const remainingText = content.slice(lastIndex);
			if (remainingText.trim()) {
				parts.push(
					<div
						key={`html-${key++}`}
						// biome-ignore lint/security/noDangerouslySetInnerHtml: This is intentional for rendering article HTML content
						dangerouslySetInnerHTML={{ __html: remainingText }}
					/>,
				);
			}
		}

		// If no code blocks were found, return the original content
		if (parts.length === 0) {
			return content;
		}

		return parts;
	}, [content]);

	return { processedContent };
};
