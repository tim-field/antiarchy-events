import { types } from "mobx-state-tree"
import db from "../utils/db"
import { generate } from "../utils/uuid"

const Node = types
  .model("Node", {
    id: types.optional(types.identifier(), generate),
    rev: types.maybe(types.string),
    type: types.string,
    attributeMap: types.optional(types.map(types.frozen), {})
  })
  .views(self => ({
    get attributes() {
      return self.attributeMap.toJSON()
    }
  }))
  .actions(self => ({
    save() {
      return db.rel.save(self.type, {
        ...self.attributes,
        id: self.id
      })
    },
    setAttributes(values) {
      self.attributeMap = values
    }
  }))

export default Node
