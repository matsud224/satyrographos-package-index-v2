import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import { Row, Col, Table } from 'react-bootstrap'
import { getPackageAbbrevName } from "../components/common"

function HomeItem(props) {
  return (
    <Row className="my-3">
      <Col>
        <h3>{props.title}</h3>
        {props.children}
      </Col>
    </Row>
  )
}

export default function Home({ data }) {
  return (
    <Layout>
      <Row>
        <Col>
          <h1>Welcome to Satyrograhos Package Index</h1>
        </Col>
      </Row>
      <HomeItem title="Notice">
        <ul>
          <li>This website is under development.</li>
          <li>If you found any problem, <Link to="https://github.com/matsud224/satyrographos-package-index/issues">send an issue</Link>.</li>
        </ul>
      </HomeItem>
      <HomeItem title="Recent updates">
        <p><Link to="/packages">show all packages...</Link></p>
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>Package</th>
              <th>Synopsis</th>
              <th>Last update</th>
            </tr>
          </thead>
          <tbody>
            {data.allPackagesJson.edges.map(({ node }, index) => (
              <tr key={index}>
                <td>{node.versions.length > 1 ? `[Updated]` : `[New]`}</td>
                <td><Link to={`/packages/` + getPackageAbbrevName(node.name)}>{getPackageAbbrevName(node.name)}</Link></td>
                <td>{node.versions[0].synopsis}</td>
                <td>{node.last_update}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </HomeItem>
    </Layout>
  )
}

export const query = graphql`
	query {
		allPackagesJson(filter: { type: { in: ["Library", "Font", "Class", "Satyrographos", "Satysfi"] } },
                      sort: { fields: [last_update], order: DESC }, limit: 10) {
			edges {
				node {
					name
          type
				  last_update(fromNow: true)
					versions {
						version
						synopsis
					}
				}
			}
		}
	}
`
