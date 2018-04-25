import { types, getParent } from "mobx-state-tree"
import Node from "./Node"

export const TYPE_EVENT = "event"

const Event = types.compose(
  "Events",
  Node,
  types.model({ type: TYPE_EVENT }).views(self => ({
    get viewer() {
      return getParent(self, 2)
    }
  }))
)

export default Event
