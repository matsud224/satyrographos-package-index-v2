#!/usr/bin/env ruby

require 'json'
require 'base64'
require 'uri'
require 'octokit'
require 'pathname'

db_path = ARGV[0]
token = ARGV[1]
client = Octokit::Client.new access_token: token
db = JSON.parse(File.read(db_path))

db.each do |p|
  archived = false
  readme = ''

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
      repopath = "#{username}/#{reponame}"
      repo = client.repo(repopath)
      archived = archived || repo.archived
      if readme == '' then
        readme = Base64.decode64(client.readme(repopath).content).force_encoding('UTF-8')
      end
    end
  end

  p['is_archived'] = archived
  p['readme'] = readme
end

File.open(db_path, 'w') do |f|
  f.write(JSON.pretty_generate(db))
end
