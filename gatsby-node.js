const { GraphQLJSONObject } = require(`graphql-type-json`)
const lunr = require(`lunr`)

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

const createIndex = async (pkgNodes, type, cache) => {
	const cacheKey = `IndexLunr`
  const cached = await cache.get(cacheKey)
  if (cached) {
    return cached
  }

  const packages = []
	const store = {}

  for (const node of pkgNodes) {
    const name = node.name
    const synopsis = node.versions[0].synopsis
    const description = node.versions[0].description
    const tags = node.versions[0].tags.join(' ')
    const fonts = node.versions[0].fonts.join(' ')
    const inline_commands = node.versions[0].inline_commands.join(' ')
    const block_commands = node.versions[0].block_commands.join(' ')
    const math_commands = node.versions[0].math_commands.join(' ')

    if (!name.endsWith('-doc')) {
      packages.push({
        name, synopsis, description, tags, fonts, inline_commands, block_commands, math_commands
      })
      store[name] = {
        synopsis
      }
    }
  }
  const index = lunr(function() {
    this.ref(`name`)
    this.field(`name`)
    this.field(`synopsis`)
    this.field(`description`)
    this.field(`tags`)
    this.field(`fonts`)
    this.field(`inline_commands`)
    this.field(`block_commands`)
    this.field(`math_commands`)
    for (const pkg of packages) {
      this.add(pkg)
    }
  })

	const json = { index: index.toJSON(), store }
  await cache.set(cacheKey, json)
  return json
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
