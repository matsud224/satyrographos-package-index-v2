import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import { getSnapshotPath } from "../components/common"
import {
  Table,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap"
import { CopyToClipboard } from "react-copy-to-clipboard"

function CommandLineItem(props) {
  if (!props.value) return null

  return (
    <div>
      <p>
        <InputGroup className="mb-3">
          <FormControl
            aria-label="Install command"
            aria-describedby="basic-addon2"
            value={props.value}
            readonly
          />
          <InputGroup.Append>
            <CopyToClipboard text={props.value}>
              <Button variant="outline-secondary">Copy</Button>
            </CopyToClipboard>
          </InputGroup.Append>
        </InputGroup>
      </p>
    </div>
  )
}

function SnapshotTable(props) {
  return (
    <Row className="mx-auto my-3">
      <Col>
        <h3>{props.title}</h3>
        <CommandLineItem
          value={`opam install satyrographos-snapshot-${props.title} && satyrographos install`}
        />
        <Table>
          <thead>
            <tr>
              <th>Snapshot</th>
            </tr>
          </thead>
          <tbody>
            {props.items.map(({ node }) => (
              <tr key={node.name}>
                <td>
                  <Link to={getSnapshotPath(node.name)}>{node.name}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  )
}

export default function SnapshotList({ data }) {
  const allSnapshots = data.allSnapshotsJson.edges
  const stableSnapshots = allSnapshots.filter(({ node }) =>
    node.name.includes("stable")
  )
  const developSnapshots = allSnapshots.filter(({ node }) =>
    node.name.includes("develop")
  )
  return (
    <Layout title="Snapshots - Satyrographos Package Index">
      <Row>
        <Col>
          <h1>Snapshots</h1>
        </Col>
      </Row>
      <SnapshotTable title="stable" items={stableSnapshots} />
      <SnapshotTable title="develop" items={developSnapshots} />
    </Layout>
  )
}

export const query = graphql`
  query {
    allSnapshotsJson(sort: { fields: [published_on], order: DESC }) {
      edges {
        node {
          name
          published_on
        }
      }
    }
  }
`
