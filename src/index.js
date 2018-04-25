import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./pages/App"
import registerServiceWorker from "./registerServiceWorker"
import Viewer from "./models/Viewer"
import { doAction } from "./utils/hooks"
import "./register"

doAction("init")

const viewer = Viewer.create()

ReactDOM.render(<App viewer={viewer} />, document.getElementById("root"))
registerServiceWorker()

window.viewer = viewer