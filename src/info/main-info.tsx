import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "../index.css"
import AppInfo from "./AppInfo"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppInfo />
    </StrictMode>
)
