#!/bin/sh

API="http://localhost:4741"
URL_PATH="/reviews/items"

curl "${API}${URL_PATH}/${ITEM}" \
  --include \
  --request GET

echo
