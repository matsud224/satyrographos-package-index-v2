#!/bin/bash

diff data.json data_new.json

if [ $? = 0 ]; then
  git checkout .
  echo "no updates found"
else
  ./post-update-info-to-slack.rb data.json data_new.json $WEBHOOK_URL
  mv data_new.json data.json
  git config user.name github-actions
  git config user.email github-actions@github.com
  git add data.json
  git add docs/*
  git commit -m "update package data"
  git push
fi
