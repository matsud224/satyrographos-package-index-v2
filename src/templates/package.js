import React from "react"
import { Link, navigate, graphql } from "gatsby"
import { Row, Col, Form, FormControl, Button, InputGroup, Table } from 'react-bootstrap'
import Layout from "../components/layout"
import marked from 'marked';
import { getPackageAbbrevName, getPackagePath, getPackagePathWithVersion } from "../components/common"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Helmet from "react-helmet"

function TextItem(props) {
	if (!props.value) return (null);

	return (
    <div>
      <h5>{props.title}</h5>
      <p>{props.value}</p>
    </div>
	)
}

function LinkItem(props) {
	if (!props.value) return (null);

	return (
    <div>
      <h5>{props.title}</h5>
      <p>
        <a href={props.value} target="__blank">
          {props.value}
        </a>
      </p>
    </div>
	)
}

function CommandLineItem(props) {
	if (!props.value) return (null);

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
        <tbody>
          {props.items.map(props.rowFunc)}
        </tbody>
      </Table>
    </div>
  )
}

class ExpandTableItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleExpandClick = this.handleExpandClick.bind(this);
    if (props.items.length > props.initialNumRows)
      this.state = {isExpanded: false};
    else
      this.state = {isExpanded: true};
  }

  handleExpandClick() {
    this.setState({isExpanded: true});
  }

  render() {
    const isExpanded = this.state.isExpanded;
    const items = isExpanded ? this.props.items : this.props.items.slice(0, this.props.initialNumRows);
    let expandButton;

    if (isExpanded) {
      expandButton = (null);
    } else {
      expandButton =
        <tr>
          <td>
            <span className="btn-link" onClick={this.handleExpandClick}>show all...</span>
          </td>
        </tr>
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
    );
  }
}

function Conditional(props) {
  if (props.condition) {
    return <div>{props.children}</div>
  } else {
    return (null)
  }
}

let basename = function(path) {
  var lst = path.split('/');
  return lst[lst.length-1];
};

const rawMarkup = (markup) => {
    const rawMarkup = marked(markup);
    return { __html: rawMarkup };
};

const fileImageStyle = {
  width: "1.5em",
  height: "1.5em",
  marginRight: "2pt"
};

export default function PackageDetails({ data }) {
  const node = data.allSitePage.edges[0].node.context
  const packageName = node.base.name
  const abbrevName = getPackageAbbrevName(packageName)
  const allVersions = node.base.versions
  const thisVersionInfo = node.thisVersion
  const packageVersion = thisVersionInfo.version
  const latestVersion = allVersions[0].version
  const isLatest = (packageVersion === latestVersion)
  const filteredDeps = thisVersionInfo.dependencies.filter((dep) =>
    dep.name === "satysfi" || dep.name === "satyrographos" || dep.name.startsWith('satysfi-'));

  return (
    <Layout>
      <Helmet>
        <title>{abbrevName} - Satyrographos Package Index</title>
      </Helmet>
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
              onChange={(e) =>
                navigate(getPackagePathWithVersion(packageName, e.target.value))}
            >
							<Form.Control as="select" custom>
								{allVersions.map((p) => {
                  const makeVersionString = (ver) =>
                    `${ver}${(ver === latestVersion) ? ' (latest)' : ''}`;
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
			<Row>
				<Col>
					<div>
						<hr />
						<span dangerouslySetInnerHTML={rawMarkup(thisVersionInfo.description)} />
						<hr />
					</div>
				</Col>
			</Row>
			<Row className="my-3">
				<Col>
					<CommandLineItem
            title="Installation"
            value={`opam install ${packageName}${isLatest ? '' : `.${node.thisVersion.version}`} && satyrographos install`}
          />
				</Col>
			</Row>
			<Row className="my-3">
				<Col>
					<LinkItem title="Homepage" value={thisVersionInfo.homepage.join()} />
				</Col>
				<Col>
					<LinkItem title="Bug reports" value={thisVersionInfo.bug_reports.join()} />
				</Col>
				<Col>
					<TextItem title="Author" value={thisVersionInfo.authors.join()} />
				</Col>
				<Col>
					<TextItem title="Maintainer" value={thisVersionInfo.maintainer.join()} />
				</Col>
				<Col>
					<TextItem title="License" value={thisVersionInfo.license.join()} />
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
              rowFunc={(f) =>
                <tr>
                  <td>
                    <a href={`../../${f}`} target="__blank">
                      <img src="/file.svg" style={fileImageStyle} alt="" class="file-img" />
                      {basename(f)}
                    </a>
                  </td>
                </tr>
              }
            />
          </Col>
        </Row>
      </Conditional>
      <Conditional condition={filteredDeps.length > 0}>
        <Row className="my-3">
          <Col>
            <MiniTableItem
              title="Dependencies"
              items={filteredDeps}
              rowFunc={(dep) =>
                <tr>
                  <td>
                    <Link to={getPackagePath(dep.name)}>
                      {getPackageAbbrevName(dep.name)}
                    </Link>
                  </td>
                  <td>{dep.constraint}</td>
                </tr>}
            />
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
              rowFunc={(f) => <tr><td>{f}</td></tr>}
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
  }
`
