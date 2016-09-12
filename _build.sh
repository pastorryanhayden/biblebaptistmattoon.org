#!/bin/bash

path="/Users/ryanhayden/github/biblebaptistmattoon.org/";
git_path="git@github.com:SitesForChurch/California-Theme.git";
need_build=false;
#!/usr/bin/env bash

echo "Navigate to web root: $path";

cd $path;

echo "Update repo ...";
git pull $git_path;

echo "Get Data";
node ./_airtable.js;
echo "Build Jekyll";
jekyll build
echo "Compile SASS";
node-sass _css/app.scss _site/assets/css/app.css;
echo "Upload via glynn";
glynn;
# echo "Sync";
# # osascript upload.scpt;
# # echo -e '\n Complete all scripts';