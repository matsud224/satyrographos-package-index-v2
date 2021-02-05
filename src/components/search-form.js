import React, { useState, useRef } from "react"
import { navigate } from "gatsby"
import { Table, Form, Button, Col } from 'react-bootstrap'

const SearchForm = ({ initialQuery = "" }) => {
  const [query, setQuery] = useState(initialQuery)

  const inputEl = useRef(null)

  const handleChange = e => {
    setQuery(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    // `inputEl.current` points to the mounted search input element
    const q = inputEl.current.value
    navigate(`/packages?q=${q}`)
  }
  return (
    <div className="my-3">
      <Form role="search" onSubmit={handleSubmit}>
        <Form.Row>
          <Col>
            <Form.Control
              ref={inputEl}
              id="search-input"
              type="search"
              value={query}
              placeholder="package name, keyword, tag, font file..."
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Button type="submit">Search</Button>
          </Col>
        </Form.Row>
      </Form>
    </div>
  )
}
export default SearchForm
