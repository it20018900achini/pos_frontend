import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import globleState from "./Redux Toolkit/globleState.js";
import { Toaster } from "@/components/ui/use-toast";
import { ThemeProvider } from "@/components/theme-provider";
import ChatPage from "./pages/Branch Manager/Chat/ChatPage.jsx";

createRoot(document.getElementById("root")).render(
  
  <StrictMode>
    <BrowserRouter>
      <Provider store={globleState}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ChatPage/>
          <App />
          <Toaster />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
