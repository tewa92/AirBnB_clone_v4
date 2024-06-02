#!/usr/bin/env bash
#start web_dynamic server

HBNB_MYSQL_USER=hbnb_dev HBNB_MYSQL_PWD=hbnb_dev_pwd HBNB_MYSQL_HOST=localhost HBNB_MYSQL_DB=hbnb_dev_db HBNB_TYPE_STORAGE=db HBNB_API_HOST=0.0.0.0 HBNB_API_PORT=5000 python3 -m web_dynamic.0-hbnb > log 2>&1 &

# Capture the process ID of the background process
pid=$!

# Store the PID in the kill file
echo $pid > kill

echo "web_dynamix started with PID: $pid"

HBNB_MYSQL_USER=hbnb_dev HBNB_MYSQL_PWD=hbnb_dev_pwd HBNB_MYSQL_HOST=localhost HBNB_MYSQL_DB=hbnb_dev_db HBNB_TYPE_STORAGE=db HBNB_API_PORT=5001 python3 -m api.v1.app > log.api 2>&1 &

# Capture the process ID of the background process
pid=$!

# Store the PID in the kill file
echo $pid >> kill

echo "api started with PID: $pid"
