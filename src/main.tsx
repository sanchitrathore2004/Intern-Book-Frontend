// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { SubmissionProvider } from "./providers/SubmissionProvider.tsx";
import { UserProvider } from "./providers/UserProvider.tsx";

const queryClient = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: <root is alway available>
createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	<QueryClientProvider client={queryClient}>
		<UserProvider>
			<BrowserRouter>
				<ThemeProvider>
					<SubmissionProvider>
						<App />
					</SubmissionProvider>
				</ThemeProvider>
			</BrowserRouter>
		</UserProvider>
	</QueryClientProvider>,
	// </StrictMode>,
);
