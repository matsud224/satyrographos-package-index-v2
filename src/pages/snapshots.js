import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import { getSnapshotPath } from "../components/common"
import { Table, Row, Col } from 'react-bootstrap'
import Helmet from "react-helmet"

function SnapshotTable(props) {
  return (
    <Row className="mx-auto my-3">
      <Col>
        <h3>{props.title}</h3>
        <Table>
          <thead>
            <tr>
              <th>Snapshot</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {props.items.map(({node}, index) => (
              <tr key={index}>
                <td><Link to={getSnapshotPath(node.name)}>{node.name}</Link></td>
                <td>{node.published_on}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  )
}

export default function SnapshotList({data}) {
  const allSnapshots = data.allSnapshotsJson.edges
  const stableSnapshots = allSnapshots.filter(({node}) => node.name.includes("stable"))
  const developSnapshots = allSnapshots.filter(({node}) => node.name.includes("develop"))
  return (
    <Layout>
      <Helmet>
        <title>Snapshots - Satyrographos Package Index</title>
      </Helmet>
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
          published_on(fromNow: true)
				}
			}
		}
	}
`
