import React, { Component } from "react"
import Axios from "axios"
import * as JsSearch from "js-search"
import { Table, Form } from 'react-bootstrap'
import { Link } from 'gatsby'
import { getPackageAbbrevName } from "../components/common"

class PackageSearch extends Component {
  state = {
    packageList: [],
    search: [],
    searchResults: [],
    isLoading: true,
    isError: false,
    searchQuery: "",
  }
  /**
   * React lifecycle method to fetch the data
   */
  async componentDidMount() {
    Axios.get("package-search-data.json")
      .then(result => {
        const packageData = result.data
        this.setState({ packageList: packageData })
        this.rebuildIndex()
      })
      .catch(err => {
        this.setState({ isError: true })
        console.log("====================================")
        console.log(`Something bad happened while fetching the data\n${err}`)
        console.log("====================================")
      })
  }

  /**
   * rebuilds the overall index based on the options
   */
  rebuildIndex = () => {
    const { packageList } = this.state
    const dataToSearch = new JsSearch.Search("name")
    /**
     *  defines a indexing strategy for the data
     * more about it in here https://github.com/bvaughn/js-search#configuring-the-index-strategy
     */
    dataToSearch.indexStrategy = new JsSearch.AllSubstringsIndexStrategy()
    /**
     * defines the sanitizer for the search
     * to prevent some of the words from being excluded
     *
     */
    dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer()
    /**
     * defines the search index
     * read more in here https://github.com/bvaughn/js-search#configuring-the-search-index
     */
    dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex("name")

    dataToSearch.addIndex("name")
    dataToSearch.addIndex("synopsis")
    dataToSearch.addIndex("description")
    dataToSearch.addIndex("fonts")
    dataToSearch.addIndex("tags")
    dataToSearch.addDocuments(packageList)
    this.setState({ search: dataToSearch, isLoading: false })
  }

  /**
   * handles the input change and perform a search with js-search
   * in which the results will be added to the state
   */
  searchData = e => {
    const { search } = this.state
    const queryResult = search.search(e.target.value)
    this.setState({ searchQuery: e.target.value, searchResults: queryResult })
  }
  handleSubmit = e => {
    e.preventDefault()
  }

  render() {
    const { packageList, searchResults, searchQuery } = this.state
    const queryResults = searchQuery === "" ? packageList : searchResults
    return (
      <div>
        <div style={{ margin: "0 auto" }}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Control type="text"
                id="Search"
                value={searchQuery}
                onChange={this.searchData}
                placeholder="package name, keyword, tag, font file..."
              />
            </Form.Group>
          </Form>
          <div>
            <Table>
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Synopsis</th>
                </tr>
              </thead>
              <tbody>
                {queryResults.map(item => {
                  return (
                    <tr>
											<td>
                        <Link to={`/packages/${getPackageAbbrevName(item.name)}`}>
                          {getPackageAbbrevName(item.name)}
                        </Link>
                      </td>
                      <td>{item.synopsis}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
            {`Number of packages: ${queryResults.length}`}
          </div>
        </div>
      </div>
    )
  }
}
export default PackageSearch
