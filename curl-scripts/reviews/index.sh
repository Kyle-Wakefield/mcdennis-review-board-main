#!/bin/sh

API="https://mcdennis-review-board.herokuapp.com"
# API="http://localhost:4741"
URL_PATH="/reviews"

curl "${API}${URL_PATH}" \
  --include \
  --request GET

echo
