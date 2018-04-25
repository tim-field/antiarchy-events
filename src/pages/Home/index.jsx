import React from "react"
import { addFilter, applyFilters } from "../../utils/hooks"
import {RENDER_ROUTE} from '../App/index';

export const RENDER_HOME = "Home.render"

addFilter(RENDER_ROUTE, (component, page, viewer) => {
  return page === "" ? <Home viewer={viewer} /> : component
})

const Home = ({ viewer }) => {
  return (
    <div>
      <h1>You can do it</h1>
      {applyFilters(RENDER_HOME, [], viewer)}
    </div>
  )
}
