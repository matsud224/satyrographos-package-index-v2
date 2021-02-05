import React from "react"
import Layout from "../components/layout"
import PackageSearch from "../components/package-search"

export default function PackageList({ data }) {
  return (
    <Layout>
      <h1>Packages</h1>
      <div className="my-3">
        <PackageSearch />
      </div>
    </Layout>
  )
}
