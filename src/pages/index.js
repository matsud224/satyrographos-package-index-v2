import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import { Row, Col, Table } from 'react-bootstrap'
import { getPackageAbbrevName } from "../components/common"
import Helmet from "react-helmet"
import FiberNewIcon from '@material-ui/icons/FiberNew';
import AutorenewIcon from '@material-ui/icons/Autorenew';

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

function ExternalLink(props) {
  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>
  )
}

export default function Home({ data }) {
  return (
    <Layout>
      <Helmet>
        <title>Satyrographos Package Index</title>
      </Helmet>
      <Row>
        <Col>
          <h1>Welcome to Satyrographos Package Index</h1>
        </Col>
      </Row>
      <HomeItem title="Notice">
        <ul>
          <li>This website provides a list of available packages for <ExternalLink href="https://github.com/na4zagin3/satyrographos">Satyrographos</ExternalLink>, the package manager for <ExternalLink href="https://github.com/gfngfn/SATySFi">SATySFi</ExternalLink>.</li>
          <li>If you found any problem, <ExternalLink href="https://github.com/matsud224/satyrographos-package-index-v2/issues">send an issue</ExternalLink>.</li>
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
            {data.allPackagesJson.edges.map(({ node }) => (
              <tr key={node.name}>
                <td>{node.versions.length > 1 ? <AutorenewIcon /> : <FiberNewIcon />}</td>
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
