#!/bin/sh

API="http://localhost:4741"
URL_PATH="/reviews/users"

curl "${API}${URL_PATH}/${USER_ID}" \
  --include \
  --request GET

echo
