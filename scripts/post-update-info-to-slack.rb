#!/usr/bin/env ruby

require 'json'
require 'slack/incoming/webhooks'


begin
  olddb = JSON.parse(File.read(ARGV[0]))
  newdb = JSON.parse(File.read(ARGV[1]))
rescue
  puts 'invalid JSON file'
  exit
end

WEBHOOK_URL = ARGV[2]

if WEBHOOK_URL == nil then
  exit
end

# find added package
added = []
newdb.each do |p|
  if not olddb.any? {|q| p['name'] == q['name'] } then
    added.push(p)
  end
end

# find updated package
updated = []
olddb.each do |p|
  newdb.each do |q|
    if p['name'] == q['name'] then
      if p['last_update'] != q['last_update'] then
        updated.push([p,q])
      end
    end
  end
end

# find removed package
removed = []
olddb.each do |p|
  if not newdb.any? {|q| p['name'] == q['name'] } then
    removed.push(p)
  end
end

def post_message_to_slack(text, attachments)
  slack = Slack::Incoming::Webhooks.new WEBHOOK_URL
  slack.post(text, attachments: [attachments])
end

def get_package_url(name)
  "https://satyrographos-packages.netlify.app/packages/#{name.delete_prefix('satysfi-')}"
end

puts '[added]'
added.each do |p|
  puts "\"#{p['name']}\""

  name = p['name']
  latest = p['versions'][0]
  version = latest['version']
  homepage = latest['homepage'].join(', ')
  synopsis = latest['synopsis']
  authors = latest['authors'].join(', ')

  pretext = ":tada: New package \"#{name}\" has been published."

  attachments = {
    fallback: pretext,
    color: "#36a64f",
    pretext: pretext,
    title: name,
    title_link: get_package_url(name),
    text: synopsis,
    fields: [
      {
        title: "Author",
        value: authors,
        short: false
      }
    ]
  }

  post_message_to_slack(nil, attachments)
end

puts '[updated]'
updated.each do |pair|
  p_old, p = pair
  puts "\"#{p['name']}\""

  name = p['name']
  old_version = p_old['versions'][0]['version']
  new_version = p['versions'][0]['version']
  homepage = p['versions'][0]['homepage'].join(', ')
  synopsis = p['versions'][0]['synopsis']
  authors = p['versions'][0]['authors'].join(', ')

  pretext = ":exclamation: \"#{name}\" has been updated from #{old_version} to #{new_version}."

  attachments = {
    fallback: pretext,
    pretext: pretext,
    title: name,
    title_link: get_package_url(name),
    text: synopsis,
    fields: [
      {
        title: "Author",
        value: authors,
        short: false
      }
    ]
  }

  post_message_to_slack(nil, attachments)
end

puts '[removed]'
removed.each do |p|
  puts "\"#{p['name']}\""

  name = p['name']

  text = ":wastebasket: \"#{name}\" has been removed."

  post_message_to_slack(text, nil)
end
