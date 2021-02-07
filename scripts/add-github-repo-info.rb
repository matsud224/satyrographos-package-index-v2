#!/usr/bin/env ruby

require 'json'
require 'uri'
require 'octokit'
require 'pathname'

db_path = ARGV[0]
token = ARGV[1]
client = Octokit::Client.new access_token: token
db = JSON.parse(File.read(db_path))

db.each do |p|
  archived = false
  latest = p['versions'][0]
  if latest['homepage'] == [] then
    next
  end
  latest['homepage'].each do |hp|
    uri = URI.parse(hp)
    if uri.host == 'github.com' then
      elems = Pathname(uri.path).each_filename.to_a
      username = elems[0]
      reponame = elems[1]
      repo = client.repo("#{username}/#{reponame}")
      archived = archived || repo.archived
    end
  end
  p['is_archived'] = archived
end

File.open(db_path, 'w') do |f|
  f.write(JSON.pretty_generate(db))
end
