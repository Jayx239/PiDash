#!/usr/bin/env bash
WAIT_TIME=5s
echo Sleeping for $WAIT_TIME seconds to wait for db to spinup
sleep $WAIT_TIME
make configureSql
make createDefaultAdmin
node index.js
