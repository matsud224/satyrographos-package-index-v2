import React from "react"
import { useStaticQuery, Link, graphql } from "gatsby"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav } from 'react-bootstrap'

export default function Layout({ children }) {
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
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Navbar.Brand>{data.site.siteMetadata.title}</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Item as="li">
              <Link to="/" className="nav-link" activeClassName="active">Home</Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Link to="/packages" className="nav-link" activeClassName="active">Packages</Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Link to="/snapshots" className="nav-link" activeClassName="active">Snapshots</Link>
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
