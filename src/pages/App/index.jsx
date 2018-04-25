import React from "react"
import { observer } from "mobx-react"
import "./App.css"
import { applyFilters } from "../../utils/hooks"

export const RENDER_ROUTE = 'App.renderRoute'

const App = ({ viewer }) => {
  return (
    <div>
      {applyFilters(RENDER_ROUTE, <p>Page Not Found</p>, viewer.page, viewer)}
    </div>
  )
}

export default observer(App)
