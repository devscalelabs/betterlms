/** biome-ignore-all lint/style/noNonNullAssertion: This is a valid, since we are using the createRoot function */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/index";
import "@betterlms/ui/globals.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
