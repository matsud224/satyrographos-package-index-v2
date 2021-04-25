#!/usr/bin/env ruby

require 'json'
require 'pathname'

db_path = ARGV[0]
db = JSON.parse(File.read(db_path))
package_root_path = ARGV[1]

db.each do |p|
  inline-commands = []
  block-commands = []
  math-commands = []

  package_path = Pathname(package_root_path) / p['name']
  if Dir.exists?(package_path) then
    `grep -rn `
  end

  latest['inline-commands'] = inline-commands
  latest['block-commands'] = block-commands
  latest['math-commands'] = math-commands
end

File.open(db_path, 'w') do |f|
  f.write(JSON.pretty_generate(db))
end
