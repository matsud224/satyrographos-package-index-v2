#!/bin/bash

diff src/data/packages.json repo2json/packages.json
DIFF_PKGS=$?
diff src/data/snapshots.json repo2json/snapshots.json
DIFF_SNAPSHOTS=$?

if [ $DIFF_PKGS = 0 ] && [ $DIFF_SNAPSHOTS = 0 ]; then
  echo "no updates found"
else
  scripts/post-update-info-to-slack.rb src/data/package.json repo2json/packages.json $WEBHOOK_URL
  mv repo2json/packages.json src/data/packages.json
  mv repo2json/snapshots.json src/data/snapshots.json
  git config user.name github-actions
  git config user.email github-actions@github.com
  git add src/data/pacakges.json
  git add src/data/snapshots.json
  git add static/docs/*
  git commit -m "update package data"
  git push
fi
