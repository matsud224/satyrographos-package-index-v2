import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import { Table } from "react-bootstrap"
import { getPackageAbbrevName, getSnapshotPath } from "../components/common"

export default function PackageSnapshots({ data }) {
  const node = data.allSitePage.edges[0].node.context
  const packageName = node.name
  const abbrevName = getPackageAbbrevName(packageName)
  const containingSnapshots = data.allSnapshotsJson.edges.flatMap(ss => {
    const found = ss.node.packages.filter(pkg => pkg.name === packageName)
    if (found.length === 1) {
      return [{ snapshot: ss.node.name, version: found[0].version }]
    } else {
      return []
    }
  })

  return (
    <Layout
      title={`Snapshots containing "${abbrevName}" - Satyrographos Package Index`}
    >
      <h1>Snapshots containing &quot;{abbrevName}&quot;</h1>
      <div className="my-3">
        <Table>
          <thead>
            <tr>
              <th>Package version</th>
              <th>Snapshot</th>
            </tr>
          </thead>
          <tbody>
            {containingSnapshots.map((item, index) => (
              <tr key={index}>
                <td>{item.version}</td>
                <td>
                  <Link to={getSnapshotPath(item.snapshot)}>
                    {item.snapshot}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
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
          }
        }
      }
    }
    allSnapshotsJson(sort: { fields: [published_on], order: DESC }) {
      edges {
        node {
          name
          published_on(fromNow: true)
          packages {
            name
            version
          }
        }
      }
    }
  }
`
