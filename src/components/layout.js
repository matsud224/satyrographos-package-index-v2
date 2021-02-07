import React from "react"
import { useStaticQuery, Link, graphql } from "gatsby"
import 'bootstrap/dist/css/bootstrap.min.css';
import Helmet from "react-helmet"
import { Container, Navbar, Nav } from 'react-bootstrap'

export default function Layout({ title, children }) {
  const data = useStaticQuery (
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )
  return (
		<div>
      <Helmet>
        <meta charset="utf-8" />
        <meta name="description" content="Satyrographos Package Index provides a list of available packages for Satyrographos, the package manager for SATySFi." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
      </Helmet>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Navbar.Brand>{data.site.siteMetadata.title}</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Item as="li">
              <Link to="/" className="nav-link">Home</Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Link to="/packages" className="nav-link">Packages</Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Link to="/snapshots" className="nav-link">Snapshots</Link>
            </Nav.Item>
            <Nav.Item as="li">
              <a href="https://github.com/matsud224/satyrographos-package-index-v2/issues" className="nav-link" target="_blank" rel="noopener noreferrer">Feedback</a>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container className="mx-auto my-3">
        {children}
      </Container>
		</div>
  )
}
