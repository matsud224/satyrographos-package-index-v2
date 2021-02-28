import React from "react"
import { Link, navigate, graphql } from "gatsby"
import {
  Alert,
  Row,
  Col,
  Form,
  FormControl,
  Button,
  InputGroup,
  Table,
} from "react-bootstrap"
import Layout from "../components/layout"
import marked from "marked"
import {
  getPackageAbbrevName,
  getPackagePath,
  getPackagePathWithVersion,
} from "../components/common"
import { CopyToClipboard } from "react-copy-to-clipboard"
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined"

const rawMarkup = markup => {
  const renderer = new marked.Renderer()
  const linkRenderer = renderer.link
  renderer.link = (href, title, text) => {
    const html = linkRenderer.call(renderer, href, title, text)
    return html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ')
  }
  const rawMarkup = marked(markup, { renderer })

  return { __html: rawMarkup }
}

function Markdown(props) {
  return <span dangerouslySetInnerHTML={rawMarkup(props.content)} />
}

function TextItem(props) {
  if (!props.value) return null

  return (
    <div>
      <h5>{props.title}</h5>
      <p>{props.value}</p>
    </div>
  )
}

function LinksItem({ title, urls }) {
  if (!urls) return null

  return (
    <div>
      <h5>{title}</h5>
      <p>
        {urls.map((url, index) => (
          <span key={url}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
            {index === urls.length - 1 ? null : <span>, </span>}
          </span>
        ))}
      </p>
    </div>
  )
}

function CommandLineItem(props) {
  if (!props.value) return null

  return (
    <div>
      <h5>{props.title}</h5>
      <p>
        <InputGroup className="mb-3">
          <FormControl
            aria-label="Install command"
            aria-describedby="basic-addon2"
            value={props.value}
            readonly
          />
          <InputGroup.Append>
            <CopyToClipboard text={props.value}>
              <Button variant="outline-secondary">Copy</Button>
            </CopyToClipboard>
          </InputGroup.Append>
        </InputGroup>
      </p>
    </div>
  )
}

function MiniTableItem(props) {
  return (
    <div>
      <h5>{props.title}</h5>
      <Table size="sm">
        <tbody>{props.items.map(props.rowFunc)}</tbody>
      </Table>
    </div>
  )
}

class ExpandTableItem extends React.Component {
  constructor(props) {
    super(props)
    this.handleExpandClick = this.handleExpandClick.bind(this)
    if (props.items.length > props.initialNumRows)
      this.state = { isExpanded: false }
    else this.state = { isExpanded: true }
  }

  handleExpandClick() {
    this.setState({ isExpanded: true })
  }

  render() {
    const isExpanded = this.state.isExpanded
    const items = isExpanded
      ? this.props.items
      : this.props.items.slice(0, this.props.initialNumRows)
    let expandButton

    if (isExpanded) {
      expandButton = null
    } else {
      expandButton = (
        <tr>
          <td>
            <span className="btn-link" onClick={this.handleExpandClick}>
              show all...
            </span>
          </td>
        </tr>
      )
    }

    return (
      <div>
        <h5>{this.props.title}</h5>
        <Table size="sm">
          <tbody>
            {items.map(this.props.rowFunc)}
            {expandButton}
          </tbody>
        </Table>
      </div>
    )
  }
}

function Conditional(props) {
  if (props.condition) {
    return <div>{props.children}</div>
  } else {
    return null
  }
}

let basename = function (path) {
  var lst = path.split("/")
  return lst[lst.length - 1]
}

export default function PackageDetails({ data }) {
  const node = data.allSitePage.edges[0].node.context
  const packageName = node.base.name
  const abbrevName = getPackageAbbrevName(packageName)
  const isArchived = node.base.is_archived
  const allVersions = node.base.versions
  const thisVersionInfo = node.thisVersion
  const packageVersion = thisVersionInfo.version
  const latestVersion = allVersions[0].version
  const isLatest = packageVersion === latestVersion
  const filteredDeps = thisVersionInfo.dependencies.filter(
    dep =>
      dep.name === "satysfi" ||
      dep.name === "satyrographos" ||
      dep.name.startsWith("satysfi-")
  )
  const hasDocumentPkg = data.allPackagesJson.edges.some(pkg =>
    pkg.node.name == packageName + "-doc"
  )

  return (
    <Layout
      title={`${abbrevName} - Satyrographos Package Index`}
      description={thisVersionInfo.synopsis}
    >
      <Row>
        <Col>
          <h1>{abbrevName}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form>
            <Form.Group
              controlId="version-select"
              onChange={e =>
                navigate(getPackagePathWithVersion(packageName, e.target.value))
              }
            >
              <Form.Control as="select" custom>
                {allVersions.map(p => {
                  const makeVersionString = ver =>
                    `${ver}${ver === latestVersion ? " (latest)" : ""}`
                  if (p.version === packageVersion) {
                    return (
                      <option value={p.version} selected>
                        {makeVersionString(p.version)}
                      </option>
                    )
                  } else {
                    return (
                      <option value={p.version}>
                        {makeVersionString(p.version)}
                      </option>
                    )
                  }
                })}
              </Form.Control>
            </Form.Group>
          </Form>
        </Col>
        <Col>
          <Link to={`${getPackagePath(packageName)}/snapshots`}>
            See all snapshots containing &quot;{abbrevName}&quot;
          </Link>
        </Col>
      </Row>
      <Conditional condition={isArchived}>
        <Row>
          <Col>
            <Alert variant="warning">
              A GitHub repository of this package seems to be archived.
              Development and maintenance may not be done anymore.
            </Alert>
          </Col>
        </Row>
      </Conditional>
      <Conditional condition={thisVersionInfo.description !== ""}>
        <Row>
          <Col>
            <div>
              <hr />
              <Markdown content={thisVersionInfo.description} />
              <hr />
            </div>
          </Col>
        </Row>
      </Conditional>
      <Row className="my-3">
        <Col>
          <CommandLineItem
            title="Installation"
            value={`opam install ${packageName}${
              isLatest ? "" : `.${node.thisVersion.version}`
            } && satyrographos install`}
          />
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <LinksItem title="Homepage" urls={thisVersionInfo.homepage} />
        </Col>
        <Col>
          <LinksItem title="Bug reports" urls={thisVersionInfo.bug_reports} />
        </Col>
        <Col>
          <TextItem title="Author" value={thisVersionInfo.authors.join(", ")} />
        </Col>
        <Col>
          <TextItem
            title="Maintainer"
            value={thisVersionInfo.maintainer.join(", ")}
          />
        </Col>
        <Col>
          <TextItem
            title="License"
            value={thisVersionInfo.license.join(", ")}
          />
        </Col>
        <Col>
          <TextItem title="Published on" value={thisVersionInfo.published_on} />
        </Col>
      </Row>
      <Conditional condition={thisVersionInfo.documents.length > 0}>
        <Row className="my-3">
          <Col>
            <MiniTableItem
              title="Document files"
              items={thisVersionInfo.documents}
              rowFunc={f => (
                <tr key={f}>
                  <td>
                    <a
                      href={`../../${f}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DescriptionOutlinedIcon />
                      {basename(f)}
                    </a>
                  </td>
                </tr>
              )}
            />
          </Col>
        </Row>
      </Conditional>
      <Conditional condition={thisVersionInfo.documents.length == 0 && hasDocumentPkg}>
        <Row className="my-3">
          <Col>
            <h5>Document files</h5>
            <Alert variant="info">
							Pre-built document files for this package will not be available until this package has been added to the latest stable snapshot.
							See the document package <Link to={getPackagePath(packageName+'-doc')}>&quot;{packageName}-doc&quot;</Link>.
            </Alert>
          </Col>
        </Row>
      </Conditional>
      <Conditional condition={filteredDeps.length > 0}>
        <Row className="my-3">
          <Col>
            <MiniTableItem
              title="Dependencies"
              items={filteredDeps}
              rowFunc={dep => (
                <tr key={dep.name}>
                  <td>
                    <Link to={getPackagePath(dep.name)}>
                      {getPackageAbbrevName(dep.name)}
                    </Link>
                  </td>
                  <td>{dep.constraint}</td>
                </tr>
              )}
            />
            <Link to={`${getPackagePath(packageName)}/reverse-dependencies`}>
              Show dependent packages...
            </Link>
          </Col>
        </Row>
      </Conditional>
      <Conditional condition={thisVersionInfo.fonts.length > 0}>
        <Row className="my-3">
          <Col>
            <ExpandTableItem
              title="Font files"
              items={thisVersionInfo.fonts}
              initialNumRows={5}
              rowFunc={f => (
                <tr key={f}>
                  <td>{f}</td>
                </tr>
              )}
            />
          </Col>
        </Row>
      </Conditional>
    </Layout>
  )
}

export const query = graphql`
  query($path: String!) {
    allSitePage(filter: { path: { eq: $path } }) {
      edges {
        node {
          context {
            base {
              name
              is_archived
              versions {
                version
              }
            }
            thisVersion {
              authors
              bug_reports
              dependencies {
                name
                constraint
              }
              documents
              description
              published_on
              fonts
              homepage
              maintainer
              license
              synopsis
              version
            }
          }
        }
      }
    }
    allPackagesJson {
      edges {
        node {
          name
          versions {
						version
          }
        }
      }
    }
  }
`
