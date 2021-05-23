import React, { Component } from "react"
import Layout from "../components/layout"
import SearchForm from "../components/search-form"
import { Link } from "gatsby"
import { getPackageAbbrevName } from "../components/common"
import { Table } from "react-bootstrap"
import Axios from "axios"
import * as JsSearch from "js-search"

class SearchResults extends Component {
  state = {
    packageList: [],
    search: undefined,
    isLoading: true,
    isError: false,
  }

  async componentDidMount() {
    Axios.get("/search.json")
      .then(result => {
        const packageList = result.data.filter(pkg => !pkg.name.endsWith('-doc'))
        this.setState({ packageList })
        this.rebuildIndex()
      })
      .catch(err => {
        this.setState({ isError: true })
        console.log("====================================")
        console.log(`Something bad happened while fetching the data\n${err}`)
        console.log("====================================")
      })
  }

  rebuildIndex = () => {
    const { packageList } = this.state
    const dataToSearch = new JsSearch.Search("name")

    dataToSearch.indexStrategy = new JsSearch.AllSubstringsIndexStrategy()
    dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer()

    dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex("name")
    dataToSearch.addIndex("name")
    dataToSearch.addIndex(["versions", "0", "synopsis"])
    dataToSearch.addIndex(["versions", "0", "description"])
    dataToSearch.addIndex(["versions", "0", "fonts"])
    dataToSearch.addIndex(["versions", "0", "tags"])
    dataToSearch.addIndex(["versions", "0", "inline_commands"])
    dataToSearch.addIndex(["versions", "0", "block_commands"])
    dataToSearch.addIndex(["versions", "0", "math_commands"])
    dataToSearch.addDocuments(packageList) // adds the data to be searched

    this.setState({
      search: dataToSearch,
			isLoading: false
		})
  }

  render() {
    const { packageList, search } = this.state
		const searchQuery = this.props.searchQuery
    const searchResults = search === undefined || searchQuery === "" ? packageList : search.search(searchQuery)
    return (
			<>
				<tbody>
					{searchResults.map(item => {
						return (
							<tr key={item.name}>
								<td>
									<Link to={`/packages/${getPackageAbbrevName(item.name)}`}>
										{getPackageAbbrevName(item.name)}
									</Link>
								</td>
								<td>{item.versions[0].synopsis}</td>
							</tr>
						)
					})}
				</tbody>
			</>
		)
  }
}

export default function PackageList({ data, location }) {
  const params = new URLSearchParams(location.search.slice(1))
  const q = decodeURIComponent(params.get("q") || "")

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
            Search results for &quot;{q}&quot;
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
					<SearchResults searchQuery={q}/>
        </Table>
      </div>
    </Layout>
  )
}
