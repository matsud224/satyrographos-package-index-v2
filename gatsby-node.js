const { GraphQLJSONObject } = require(`graphql-type-json`)

const fs = require("fs")
const path = require("path")
const pkgdata = require("./src/data/packages.json")
const ssdata = require("./src/data/snapshots.json")

fs.copyFile("./src/data/packages.json", "./static/search.json", (err) => {
  if (err) throw err;
})

function getPackageAbbrevName(name) {
  if (name.startsWith('satysfi-'))
    return name.substring(8)

  return name
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const pkgtemplate = path.resolve("./src/templates/package.js")

  pkgdata.forEach(node => {
    const path = `packages/${getPackageAbbrevName(node.name)}`
    const latestVersion = node.versions[0]

    createPage({
      path,
      component: pkgtemplate,
      context: { base: node, thisVersion: latestVersion }
    })
  })

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

  const pkgrevdepstemplate = path.resolve("./src/templates/rev-deps.js")
  pkgdata.forEach(node => {
    const path = `packages/${getPackageAbbrevName(node.name)}/reverse-dependencies`
    createPage({
      path,
      component: pkgrevdepstemplate,
      context: node,
    })
  })
}

exports.createResolvers = ({ cache, createResolvers }) => {
  createResolvers({
    Query: {
      LunrIndex: {
        type: GraphQLJSONObject,
        resolve: (source, args, context, info) => {
          const pkgNodes = context.nodeModel.getAllNodes({
            type: `PackagesJson`,
          })
          const type = info.schema.getType(`PackagesJson`)
          return createIndex(pkgNodes, type, cache)
        },
      },
    },
  })
}
