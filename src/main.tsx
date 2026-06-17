import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { App } from "@/App"
import { WalletProvider } from "@/hooks/useWallet"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import "@/index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <WalletProvider>
          <App />
        </WalletProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
