import React from "react"
import Layout from "../components/layout"
import SearchForm from "../components/search-form"
import { Index } from "lunr"
import { Link, graphql } from "gatsby"
import { getPackageAbbrevName } from "../components/common"
import { Table } from "react-bootstrap"

export default function PackageList({ data, location }) {
  const params = new URLSearchParams(location.search.slice(1))
  const q = params.get("q") || ""

  const { store } = data.LunrIndex
  const index = Index.load(data.LunrIndex.index)
  let results = []
  try {
    results = index.search(q.split(/\s+/).map(s => `*${s}*`).join(' ')).map(({ ref }) => {
      return {
        name: ref,
        ...store[ref],
      }
    })
  } catch (error) {
    console.log(error)
  }

  return (
    <Layout
      title={
        (q ? `Search results for "${q}"` : `Packages`) +
        " - Satyrographos Package Index"
      }
    >
      <h1>Packages</h1>
      <div className="my-3">
        {q ? (
          <h4>
            Search results for &quot;{q}&quot;: {results.length} packages
          </h4>
        ) : null}
        <SearchForm initialQuery={q} />
        <Table>
          <thead>
            <tr>
              <th>Package</th>
              <th>Synopsis</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => {
              return (
                <tr key={result.name}>
                  <td>
                    <Link to={`/packages/${getPackageAbbrevName(result.name)}`}>
                      {getPackageAbbrevName(result.name)}
                    </Link>
                  </td>
                  <td>{result.synopsis}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    LunrIndex
  }
`
