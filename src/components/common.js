export function getPackageAbbrevName(name) {
  if (name.startsWith('satysfi-'))
    return name.substring(8)

  return name
}

export function getPackagePath(name) {
  return `/packages/${getPackageAbbrevName(name)}`
}

export function getPackagePathWithVersion(name, ver) {
  return `${getPackagePath(name)}/${ver}`
}

export function getSnapshotPath(name) {
  return `/snapshots/${name}`
}
