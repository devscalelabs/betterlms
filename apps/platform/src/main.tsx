/** biome-ignore-all lint/style/noNonNullAssertion: This is a valid, since we are using the createRoot function */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/index";
import "./index.css";
import "@betterlms/ui/globals.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
