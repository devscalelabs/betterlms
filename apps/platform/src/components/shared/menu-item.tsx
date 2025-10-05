import { Button } from "@betterlms/ui";
import type React from "react";

export const MenuItem = ({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick?: () => void;
}) => {
	return (
		<Button
			type="button"
			variant="ghost"
			className="w-full justify-start text-base"
			onClick={onClick}
		>
			{children}
		</Button>
	);
};
