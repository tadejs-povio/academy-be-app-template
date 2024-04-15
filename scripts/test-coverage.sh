#!/bin/bash -e

npm run test -- --coverage
npm run test:e2e -- --coverage

rm -rf ./coverage/merged
mkdir -p ./coverage/merged

cp ./coverage/unit/coverage-final.json ./coverage/merged/unit-coverage-final.json
cp ./coverage/e2e/coverage-final.json ./coverage/merged/e2e-coverage-final.json

npx nyc merge ./coverage/merged ./coverage/merged/merged-coverage.json

npx nyc report -t ./coverage/merged --report-dir ./coverage/merged/report --reporter=html --reporter=text

open ./coverage/merged/report/index.html



