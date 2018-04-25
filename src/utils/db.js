import PouchDB from "pouchdb"
import PouchRelational from "relational-pouch"
import PouchDBFind from "pouchdb-find"

const DB_NAME = "antiarchy"

PouchDB.plugin(PouchRelational)
PouchDB.plugin(PouchDBFind)

const db = new PouchDB(DB_NAME)
db.setSchema([
  {
    singular: "event",
    plural: "events",
    relations: {
      creator: { belongsTo: "creator" },
      posts: { hasMany: "post" }
    }
  },
  {
    singular: "creator",
    plural: "creators",
    relations: {
      events: { hasMany: "event" },
      posts: { hasMany: "post" }
    }
  },
  {
    singular: "post",
    plural: "posts",
    relations: {
      event: { belongsTo: "event" },
      author: { belongsTo: "creator" }
    }
  }
])

export const fromCouchToSnapshot = ({ id, rev, type, ...attributes }) => ({
  id,
  rev,
  type,
  attributeMap: attributes
})

export default db
