import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import { Row, Col, Table, Jumbotron, Button } from "react-bootstrap"
import { getPackageAbbrevName } from "../components/common"
import FiberNewIcon from "@material-ui/icons/FiberNew"
import AutorenewIcon from "@material-ui/icons/Autorenew"

function HomeItem(props) {
  return (
    <Row>
      <Col>
        <h3>{props.title}</h3>
        {props.children}
      </Col>
    </Row>
  )
}

function ExternalLink(props) {
  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  )
}

export default function Home({ data }) {
  return (
    <Layout title="Satyrographos Package Index">
      <Row>
        <Col>
          <Jumbotron>
            <h1>Welcome to Satyrographos Package Index</h1>
            <p>
              Satyrographos Package Index provides a list of available packages
              for{" "}
              <ExternalLink href="https://github.com/na4zagin3/satyrographos">
                Satyrographos
              </ExternalLink>
              , the package manager for{" "}
              <ExternalLink href="https://github.com/gfngfn/SATySFi">
                SATySFi
              </ExternalLink>
              .
            </p>
            <div>
              <Button variant="outline-primary">
                <ExternalLink href="https://github.com/na4zagin3/satyrographos/blob/master/README.md#satyrographos">
                  How to use Satyrographos
                </ExternalLink>
              </Button>{" "}
              <Button variant="outline-primary">
                <ExternalLink href="https://github.com/na4zagin3/satyrographos/blob/master/README.md#for-library-authors">
                  Publish your package
                </ExternalLink>
              </Button>
            </div>
          </Jumbotron>
        </Col>
      </Row>
      <HomeItem title="Recent updates">
        <p>
          <Link to="/packages">show all packages...</Link>
        </p>
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>Package</th>
              <th>Synopsis</th>
            </tr>
          </thead>
          <tbody>
            {data.allPackagesJson.edges.map(({ node }) => (
              <tr key={node.name}>
                <td>
                  {node.versions.length > 1 ? (
                    <AutorenewIcon />
                  ) : (
                    <FiberNewIcon />
                  )}
                </td>
                <td>
                  <Link to={`/packages/` + getPackageAbbrevName(node.name)}>
                    {getPackageAbbrevName(node.name)}
                  </Link>
                </td>
                <td>{node.versions[0].synopsis}</td>
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
    allPackagesJson(
      filter: {
        type: { in: ["Library", "Font", "Class", "Satyrographos", "Satysfi"] }
      }
      sort: { fields: [last_update], order: DESC }
      limit: 10
    ) {
      edges {
        node {
          name
          type
          last_update
          versions {
            version
            synopsis
          }
        }
      }
    }
  }
`
