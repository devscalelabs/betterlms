import { Color } from "@tiptap/extension-color";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	Code,
	Heading1,
	Heading2,
	Heading3,
	Highlighter,
	Image as ImageIcon,
	Italic,
	List,
	ListOrdered,
	Palette,
	Quote,
	Redo,
	Strikethrough,
	Undo,
} from "lucide-react";
import type { ReactNode } from "react";
import { useId } from "react";

const ToolbarButton = ({
	onClick,
	isActive,
	children,
	disabled,
}: {
	onClick: () => void;
	isActive?: boolean;
	children: ReactNode;
	disabled?: boolean;
}) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		className={`p-2 rounded-md transition-colors ${
			isActive
				? "bg-gray-900 text-white"
				: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
		} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
	>
		{children}
	</button>
);

interface ArticleEditorProps {
	content?: string;
	onChange?: (content: string) => void;
	placeholder?: string;
	onImageUpload?: (file: File) => Promise<string>;
}

export const ArticleEditor = ({
	content = "",
	onChange,
	placeholder = "Start writing your article...",
	onImageUpload,
}: ArticleEditorProps) => {
	const imageUploadId = useId();
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: false, // Disable default heading to use our custom one
			}),
			Heading.configure({
				levels: [1, 2, 3, 4, 5, 6],
				HTMLAttributes: {
					class: "font-bold",
				},
			}),
			Placeholder.configure({
				placeholder,
			}),
			TextStyle,
			Color,
			Highlight.configure({
				multicolor: true,
			}),
			Image.configure({
				inline: true,
				allowBase64: false,
			}),
		],
		content,
		onUpdate: ({ editor }) => {
			onChange?.(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class:
					"prose max-w-none focus:outline-none min-h-[400px] p-6 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-strong:font-semibold",
			},
		},
	});

	const handleImageUpload = async (file: File) => {
		if (!onImageUpload) return;

		try {
			const imageUrl = await onImageUpload(file);
			editor.chain().focus().setImage({ src: imageUrl }).run();
		} catch (error) {
			console.error("Failed to upload image:", error);
		}
	};

	const handleImageInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
			handleImageUpload(file);
		}
		// Reset the input value so the same file can be selected again
		event.target.value = "";
	};

	if (!editor) {
		return null;
	}

	return (
		<div className="border border-gray-200 rounded-lg overflow-hidden">
			{/* Toolbar */}
			<div className="border-b border-gray-200 bg-gray-50 p-3 flex flex-wrap gap-1">
				{/* Text formatting */}
				<div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleBold().run()}
						isActive={editor.isActive("bold")}
						disabled={!editor.can().toggleBold()}
					>
						<Bold className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleItalic().run()}
						isActive={editor.isActive("italic")}
						disabled={!editor.can().toggleItalic()}
					>
						<Italic className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleStrike().run()}
						isActive={editor.isActive("strike")}
						disabled={!editor.can().toggleStrike()}
					>
						<Strikethrough className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleCode().run()}
						isActive={editor.isActive("code")}
						disabled={!editor.can().toggleCode()}
					>
						<Code className="h-4 w-4" />
					</ToolbarButton>
				</div>

				{/* Headings */}
				<div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
					<ToolbarButton
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						}
						isActive={editor.isActive("heading", { level: 1 })}
						disabled={!editor.can().toggleHeading({ level: 1 })}
					>
						<Heading1 className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
						isActive={editor.isActive("heading", { level: 2 })}
						disabled={!editor.can().toggleHeading({ level: 2 })}
					>
						<Heading2 className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 3 }).run()
						}
						isActive={editor.isActive("heading", { level: 3 })}
						disabled={!editor.can().toggleHeading({ level: 3 })}
					>
						<Heading3 className="h-4 w-4" />
					</ToolbarButton>
				</div>

				{/* Lists */}
				<div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						isActive={editor.isActive("bulletList")}
						disabled={!editor.can().toggleBulletList()}
					>
						<List className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						isActive={editor.isActive("orderedList")}
						disabled={!editor.can().toggleOrderedList()}
					>
						<ListOrdered className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
						isActive={editor.isActive("blockquote")}
						disabled={!editor.can().toggleBlockquote()}
					>
						<Quote className="h-4 w-4" />
					</ToolbarButton>
				</div>

				{/* Colors and highlighting */}
				<div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
					<ToolbarButton
						onClick={() => editor.chain().focus().setColor("#ef4444").run()}
						isActive={editor.isActive("textStyle", { color: "#ef4444" })}
					>
						<Palette className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() =>
							editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()
						}
						isActive={editor.isActive("highlight")}
					>
						<Highlighter className="h-4 w-4" />
					</ToolbarButton>
				</div>

				{/* Image upload */}
				{onImageUpload && (
					<div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
						<input
							type="file"
							accept="image/png,image/jpeg"
							onChange={handleImageInputChange}
							className="hidden"
							id={imageUploadId}
						/>
						<ToolbarButton
							onClick={() => document.getElementById(imageUploadId)?.click()}
						>
							<ImageIcon className="h-4 w-4" />
						</ToolbarButton>
					</div>
				)}

				{/* Undo/Redo */}
				<div className="flex items-center gap-1">
					<ToolbarButton
						onClick={() => editor.chain().focus().undo().run()}
						disabled={!editor.can().undo()}
					>
						<Undo className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().redo().run()}
						disabled={!editor.can().redo()}
					>
						<Redo className="h-4 w-4" />
					</ToolbarButton>
				</div>
			</div>

			{/* Editor content */}
			<EditorContent editor={editor} />
		</div>
	);
};
