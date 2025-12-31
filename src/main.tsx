// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import { UserProvider } from "./providers/UserProvider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	// <StrictMode>
		<QueryClientProvider client={queryClient}>
			<UserProvider>
				<BrowserRouter>
					<ThemeProvider>
						<App />
					</ThemeProvider>
				</BrowserRouter>
			</UserProvider>
		</QueryClientProvider>
	// </StrictMode>,
);
