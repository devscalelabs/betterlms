import { cn } from "@betterlms/ui/utils";
import type React from "react";

interface HeadingBoxProps {
	children: React.ReactNode;
	className?: string;
}

export const HeadingBox = ({ children, className }: HeadingBoxProps) => {
	return (
		<header
			className={cn(
				"h-14 border-b border-border flex items-center text-sm font-medium justify-between px-4",
				className,
			)}
		>
			{children}
		</header>
	);
};
