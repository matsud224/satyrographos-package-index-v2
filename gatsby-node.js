const path = require("path")
const pkgdata = require("./src/data/packages.json")
const ssdata = require("./src/data/snapshots.json")

function getPackageAbbrevName(name) {
  if (name.startsWith('satysfi-'))
    return name.substring(8)

  return name
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const fs = require('fs')

  const pkgtemplate = path.resolve("./src/templates/package.js")
  const packageSearchData = []

  pkgdata.forEach(node => {
    const path = `packages/${getPackageAbbrevName(node.name)}`
    const latestVersion = node.versions[0]

    createPage({
      path,
      component: pkgtemplate,
      context: { base: node, thisVersion: latestVersion }
    })

    if (!node.name.endsWith('-doc')) {
      packageSearchData.push({
        name: node.name,
        synopsis: latestVersion.synopsis,
        description: latestVersion.description,
        fonts: latestVersion.fonts.join(' '),
        tags: latestVersion.tags.join(' '),
      })
    }
  })

  fs.writeFileSync('./static/package-search-data.json', JSON.stringify(packageSearchData, null, 2))

  pkgdata.forEach(node => {
    node.versions.forEach(version => {
      const path = `packages/${getPackageAbbrevName(node.name)}/${version.version}`
      createPage({
        path,
        component: pkgtemplate,
        context: { base: node, thisVersion: version }
      })
    })
  })

  const sstemplate = path.resolve("./src/templates/snapshot.js")
  ssdata.forEach(node => {
    const path = `snapshots/${node.name}`
    createPage({
      path,
      component: sstemplate,
      context: node,
    })
  })

  const pkgsstemplate = path.resolve("./src/templates/package-snapshots.js")
  pkgdata.forEach(node => {
    const path = `packages/${getPackageAbbrevName(node.name)}/snapshots`
    createPage({
      path,
      component: pkgsstemplate,
      context: node,
    })
  })

}
