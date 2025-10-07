import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
	code: string;
	language?: string | undefined;
	className?: string;
}

export const CodeBlock = ({
	code,
	language,
	className = "",
}: CodeBlockProps) => {
	const [detectedLanguage, setDetectedLanguage] = useState<string>("text");

	useEffect(() => {
		if (language) {
			setDetectedLanguage(language);
			return;
		}

		// Auto-detect language based on common patterns
		const trimmedCode = code.trim();

		// Check for shebang
		if (trimmedCode.startsWith("#!")) {
			const shebang = trimmedCode.split("\n")[0];
			if (shebang?.includes("python")) {
				setDetectedLanguage("python");
				return;
			}
			if (shebang?.includes("node")) {
				setDetectedLanguage("javascript");
				return;
			}
			if (shebang?.includes("bash") || shebang?.includes("sh")) {
				setDetectedLanguage("bash");
				return;
			}
		}

		// Check for common keywords and patterns
		if (trimmedCode.includes("function") && trimmedCode.includes("=>")) {
			setDetectedLanguage("javascript");
			return;
		}

		if (trimmedCode.includes("def ") && trimmedCode.includes(":")) {
			setDetectedLanguage("python");
			return;
		}

		if (trimmedCode.includes("import ") && trimmedCode.includes("from ")) {
			setDetectedLanguage("python");
			return;
		}

		if (
			trimmedCode.includes("const ") ||
			trimmedCode.includes("let ") ||
			trimmedCode.includes("var ")
		) {
			setDetectedLanguage("javascript");
			return;
		}

		if (trimmedCode.includes("<?php")) {
			setDetectedLanguage("php");
			return;
		}

		if (trimmedCode.includes("<!DOCTYPE") || trimmedCode.includes("<html")) {
			setDetectedLanguage("html");
			return;
		}

		if (
			trimmedCode.includes("SELECT") ||
			trimmedCode.includes("INSERT") ||
			trimmedCode.includes("UPDATE")
		) {
			setDetectedLanguage("sql");
			return;
		}

		if (trimmedCode.includes("package ") && trimmedCode.includes("import ")) {
			setDetectedLanguage("go");
			return;
		}

		if (trimmedCode.includes("fn ") && trimmedCode.includes("->")) {
			setDetectedLanguage("rust");
			return;
		}

		if (
			trimmedCode.includes("public class") ||
			trimmedCode.includes("public static")
		) {
			setDetectedLanguage("java");
			return;
		}

		if (trimmedCode.includes("using ") && trimmedCode.includes("namespace")) {
			setDetectedLanguage("csharp");
			return;
		}

		if (
			trimmedCode.includes("#include") &&
			(trimmedCode.includes("int main") || trimmedCode.includes("printf"))
		) {
			setDetectedLanguage("c");
			return;
		}

		if (
			trimmedCode.includes("console.log") ||
			trimmedCode.includes("console.error")
		) {
			setDetectedLanguage("javascript");
			return;
		}

		// Default to text if no pattern matches
		setDetectedLanguage("text");
	}, [code, language]);

	return (
		<div className={`relative ${className}`}>
			<SyntaxHighlighter
				language={detectedLanguage}
				style={oneDark}
				customStyle={{
					margin: 0,
					borderRadius: "0.5rem",
					fontSize: "0.875rem",
					lineHeight: "1.5",
				}}
				showLineNumbers={code.split("\n").length > 5}
				wrapLines
				wrapLongLines
			>
				{code}
			</SyntaxHighlighter>
		</div>
	);
};
