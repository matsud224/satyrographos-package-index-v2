import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import { Table } from 'react-bootstrap'
import { getPackageAbbrevName, getPackagePath } from "../components/common"

export default function PackageRevDeps({ data }) {
  const node = data.allSitePage.edges[0].node.context;
  const packageName = node.name
  const abbrevName = getPackageAbbrevName(packageName)

  const revDeps = []
  data.allPackagesJson.edges.forEach((pkg) => {
    const found = []
    pkg.node.versions.forEach((ver) => {
      const foundDeps = ver.dependencies.filter((dep) => dep.name === packageName)
      if (foundDeps.length > 0)
        found.push(foundDeps[0])
    })
    if (found.length > 0)
      revDeps.push({name: pkg.node.name, constraint: found[0].constraint})
  })

  return (
    <Layout title={`Reverse dependencies of "${abbrevName}" - Satyrographos Package Index`}>
      <h1>Reverse dependencies of &quot;{abbrevName}&quot;</h1>
      <div className="my-3">
        <Table>
          <thead>
            <tr>
              <th>Package</th>
            </tr>
          </thead>
          <tbody>
            {revDeps.map((item, index) => (
              <tr key={index}>
                <td>
                  <Link to={getPackagePath(item.name)}>
                    {getPackageAbbrevName(item.name)}
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
    allPackagesJson {
      edges {
        node {
          name
          versions {
            dependencies {
              name
              constraint
            }
          }
        }
      }
    }

  }
`
