import React from "react"
import { Table } from "react-bootstrap"

export function getPackageAbbrevName(name) {
  if (name.startsWith("satysfi-")) return name.substring(8)

  return name
}

export function getPackagePath(name) {
  return `/packages/${getPackageAbbrevName(name)}`
}

export function getPackagePathWithVersion(name, ver) {
  return `${getPackagePath(name)}/${ver}`
}

export function getSnapshotPath(name) {
  return `/snapshots/${name}`
}

export class ExpandTableItem extends React.Component {
  constructor(props) {
    super(props)
    this.handleExpandClick = this.handleExpandClick.bind(this)
    if (props.items.length > props.initialNumRows)
      this.state = { isExpanded: false }
    else this.state = { isExpanded: true }
  }

  handleExpandClick() {
    this.setState({ isExpanded: true })
  }

  render() {
    const isExpanded = this.state.isExpanded
    const items = isExpanded
      ? this.props.items
      : this.props.items.slice(0, this.props.initialNumRows)
    let expandButton

    if (isExpanded) {
      expandButton = null
    } else {
      expandButton = (
        <tr>
          <td>
            <span className="btn-link" onClick={this.handleExpandClick}>
              show all...
            </span>
          </td>
        </tr>
      )
    }

    return (
      <div>
        <Table size={this.props.isSmall ? "sm" : "md"}>
          <tbody>
            {items.map(this.props.rowFunc)}
            {expandButton}
          </tbody>
        </Table>
      </div>
    )
  }
}
