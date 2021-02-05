#!/usr/bin/env ruby

require 'json'
require 'slack/incoming/webhooks'


begin
  oldjson = JSON.parse(File.read(ARGV[0]))
  newjson = JSON.parse(File.read(ARGV[1]))
rescue
  puts 'invalid JSON file'
  exit
end

WEBHOOK_URL = ARGV[2]

oldinfo = oldjson['data']
newinfo = newjson['data']

# find added package
added = []
newinfo.each do |p|
  if not oldinfo.any? {|q| p['name'] == q['name'] } then
    added.push(p)
  end
end

# find updated package
updated = []
oldinfo.each do |p|
  newinfo.each do |q|
    if p['name'] == q['name'] then
      if p['last_update'] != q['last_update'] then
        updated.push([p,q])
      end
    end
  end
end

# find removed package
removed = []
oldinfo.each do |p|
  if not newinfo.any? {|q| p['name'] == q['name'] } then
    removed.push(p)
  end
end

def post_message_to_slack(text, attachments)
  slack = Slack::Incoming::Webhooks.new WEBHOOK_URL
  slack.post(text, attachments: [attachments])
end

puts '[added]'
added.each do |p|
  puts "\"#{p['name']}\""

  name = p['name']
  version = p['latest_version']
  homepage = p['homepage']
  synopsis = p['synopsis']
  authors = p['authors']

  pretext = ":tada: New package \"#{name}\" was published."

  attachments = {
    fallback: pretext,
    color: "#36a64f",
    pretext: pretext,
    title: name,
    title_link: homepage,
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
  old_version = p_old['latest_version']
  new_version = p['latest_version']
  homepage = p['homepage']
  synopsis = p['synopsis']
  authors = p['authors']

  if old_version == new_version then
    pretext = ":exclamation: \"#{name}\" was updated."
  else
    pretext = ":exclamation: \"#{name}\" was updated from #{old_version} to #{new_version}."
  end

  attachments = {
    fallback: pretext,
    pretext: pretext,
    title: name,
    title_link: homepage,
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

  text = ":wastebasket: \"#{name}\" was removed."

  post_message_to_slack(text, nil)
end
