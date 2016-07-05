# Copyright 2015, EMC, Inc.

cd ./static

# Copy templates from apidoc, taskdoc leverage apidoc templates for html rendering
cp -rf ../node_modules/apidoc/template/* taskdoc/

# Generate task doc from task schemas
cd ../node_modules/on-tasks/
#_mocha 'spec/lib/utils/task-option-doc-generator.js' --require spec/helper

#echo 'define({"api":' > api_data.js
#cat task_doc_data.json | python -m json.tool >> api_data.js
#echo '});' >> api_data.js

# Copy generated json file to ./static folder, override existing files
#cp -f api_data.js ../../static/
#cp -f task_doc_data.json ../../static/api_data.json

# Remove generated html files.
#rm api_data.js task_doc_data.json