import { types, flow } from "mobx-state-tree"
import Event, { TYPE_EVENT } from "./Event"
import db, { fromCouchToSnapshot } from "../utils/db"

const Viewer = types
  .model("Viewer", {
    page: "",
    events: types.optional(types.map(Event), {})
  })
  .actions(self => ({
    setPage(page) {
      self.page = page
    },
    loadEvents: flow(function*() {
      const res = yield db.rel.find(TYPE_EVENT)
      res.events.map(fromCouchToSnapshot).forEach(event => {
        self.events.put(event)
      })
    })
  }))

export default Viewer
