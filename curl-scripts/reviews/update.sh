#!/bin/bash

API="https://mcdennis-review-board.herokuapp.com"
# API="http://localhost:4741"
URL_PATH="/reviews"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "review": {
      "item": "'"${ITEM}"'",
      "title": "'"${TITLE}"'",
      "body": "'"${BODY}"'"
    }
  }'

echo
