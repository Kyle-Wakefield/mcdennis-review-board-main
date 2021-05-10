#!/bin/sh

API="https://mcdennis-review-board.herokuapp.com"
# API="http://localhost:4741"
URL_PATH="/reviews/${ID}"

curl "${API}${URL_PATH}" \
  --include \
  --request GET

echo
