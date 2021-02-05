import React from "react"
import Layout from "../components/layout"
import PackageSearch from "../components/package-search"
import Helmet from "react-helmet"

export default function PackageList({ data }) {
  return (
    <Layout>
      <Helmet>
        <title>Packages - Satyrographos Package Index</title>
      </Helmet>
      <h1>Packages</h1>
      <div className="my-3">
        <PackageSearch />
      </div>
    </Layout>
  )
}
