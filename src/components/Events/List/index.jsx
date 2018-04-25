import React from "react"
import { addFilter } from "../../../utils/hooks"
import { observer } from "mobx-react"
import { RENDER_HOME } from "../../../pages/Home/index"

addFilter(RENDER_HOME, (render, viewer) => {
  viewer.loadEvents()
  return render.concat(<ListEvents viewer={viewer} />)
})

const ListEvents = observer(({ viewer }) => {
  const events = [...viewer.events.values()]
  return (
    <ul>
      <li>Async Fetch These</li>
      {events.map(event => <li key={event.id}>{event.attributes.description}</li>)}
    </ul>
  )
})
