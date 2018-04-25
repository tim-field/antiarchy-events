import React, { Component } from "react"
import { addFilter } from "../../../utils/hooks"
import { RENDER_HOME } from "../../../pages/Home/index"
import Event from "../../../models/Event"

const render = (components, viewer) => {
  return components.concat(<AddEvent viewer={viewer} />)
}

addFilter(RENDER_HOME, render)

class AddEvent extends Component {
  state = { fields: {} }

  onChange = ({ target: { name, value } }) => {
    this.setState({
      fields: {
        ...this.state.fields,
        [name]: value
      }
    })
  }

  onSave = async e => {
    e.preventDefault()
    const event = Event.create()
    event.setAttributes(this.state.fields)
    await event.save()
    this.props.viewer.loadEvents()
    this.setState({ fields: {} })
  }

  render() {
    const { fields } = this.state

    return (
      <form onSubmit={this.onSave}>
        <textarea
          name="description"
          value={fields.description || ""}
          onChange={this.onChange}
        />
        <button>Add Event</button>
      </form>
    )
  }
}
