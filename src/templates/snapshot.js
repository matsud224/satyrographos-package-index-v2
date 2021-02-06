import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import { Row, Col, InputGroup, FormControl, Button, Table } from 'react-bootstrap'
import { getPackageAbbrevName } from "../components/common"
import { CopyToClipboard } from 'react-copy-to-clipboard'

function CommandLineItem(props) {
	if (!props.value) return (null);

	return (
    <div>
      <h5>{props.title}</h5>
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

export default function SnapshotDetails({ data }) {
  const node = data.allSitePage.edges[0].node.context;
  const filteredPkgs = node.packages.filter((pkg) => !pkg.name.endsWith('-doc'))

  return (
    <Layout title={`${node.name} - Satyrographos Package Index`}>
      <Row className="my-3">
        <Col>
          <h1>{node.name}</h1>
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
					<CommandLineItem
            title="Installation"
            value={`opam install ${node.name} && satyrographos install`}
          />
				</Col>
      </Row>
      <Row>
        <Col>
          <Table>
            <thead>
              <tr>
                <th>Package</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              {filteredPkgs.map((pkg) => (
                <tr key={pkg.name}>
                  <td>
                    <Link to={`/packages/${getPackageAbbrevName(pkg.name)}/${pkg.version}`}>
                      {getPackageAbbrevName(pkg.name)}
                   </Link>
                  </td>
                  <td>{getPackageAbbrevName(pkg.version)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Layout>
  )
}

export const query = graphql`
  query($path: String!) {
    allSitePage(filter: { path: { eq: $path } }) {
      edges {
        node {
          context {
						name
						published_on
            packages {
              name
              version
            }
          }
        }
      }
    }
  }
`
