#/bin/bash
#upload files
s3cmd --exclude '.git/*' sync --delete-removed ./dist/ s3://amoba.0x01.hu/
#set content type of css files
s3cmd --recursive modify --add-header='content-type':'text/css' --exclude '' --include '.css' s3://amoba.0x01.hu/
#make everything public
s3cmd setacl s3://amoba.0x01.hu --acl-public --recursive
