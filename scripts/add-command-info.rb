#!/usr/bin/env ruby

require 'json'
require 'pathname'

db_path = ARGV[0]
db = JSON.parse(File.read(db_path))
package_root_path = ARGV[1]

db.each do |p|
  inline_commands = []
  block_commands = []
  math_commands = []

  package_path = Pathname(package_root_path) / p['name']
  if Dir.exists?(package_path) then
    inline_commands = `grep -Rh let-inline #{package_path} | grep -ho '\\\\[0-9a-zA-Z-]*'`.split(/\R/)
    block_commands = `grep -Rh let-block #{package_path} | grep -ho '\\+[0-9a-zA-Z-]*'`.split(/\R/)
    inline_math = `grep -Rh let-math #{package_path} | grep -ho '\\\\[0-9a-zA-Z-]*'`.split(/\R/)
  end

  latest = p['versions'][0]
  latest['inline-commands'] = inline_commands
  latest['block-commands'] = block_commands
  latest['math-commands'] = math_commands
end

File.open(db_path, 'w') do |f|
  f.write(JSON.pretty_generate(db))
end
