## Links
Deployed Server: https://mcdennis-review-board.herokuapp.com

## ERD
![wireframe-erd](https://media.git.generalassemb.ly/user/35162/files/d8bd2280-a296-11eb-9cd4-9e1d3eca181a)

## API

Use this as the basis for your own API documentation. Add a new third-level
heading for your custom entities, and follow the pattern provided for the
built-in user authentication documentation.

Scripts are included in [`curl-scripts`](curl-scripts) to test built-in actions.
Add your own scripts to test your custom API.

### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/` | `users#changepw`  |
| DELETE | `/sign-out/`        | `users#signout`   |

#### POST /sign-up

Request:

```sh
curl --include --request POST https://mcdennis-review-board.herokuapp.com/sign-up \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "an@example.email",
      "password": "an example password",
      "password_confirmation": "an example password"
    }
  }'
```

```sh
curl-scripts/sign-up.sh
```

Response:

```md
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "user": {
    "id": 1,
    "email": "an@example.email"
  }
}
```

#### POST /sign-in

Request:

```sh
curl --include --request POST https://mcdennis-review-board.herokuapp.com/sign-in \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "an@example.email",
      "password": "an example password"
    }
  }'
```

```sh
curl-scripts/sign-in.sh
```

Response:

```md
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "user": {
    "id": 1,
    "email": "an@example.email",
    "token": "33ad6372f795694b333ec5f329ebeaaa"
  }
}
```

#### PATCH /change-password/

Request:

```sh
curl --include --request PATCH https://mcdennis-review-board.herokuapp.com/change-password/ \
  --header "Authorization: Bearer $TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "passwords": {
      "old": "an example password",
      "new": "super sekrit"
    }
  }'
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa curl-scripts/change-password.sh
```

Response:

```md
HTTP/1.1 204 No Content
```

#### DELETE /sign-out/

Request:

```sh
curl --include --request DELETE https://mcdennis-review-board.herokuapp.com/sign-out/ \
  --header "Authorization: Bearer $TOKEN"
```

```sh
TOKEN=33ad6372f795694b333ec5f329ebeaaa curl-scripts/sign-out.sh
```

Response:

```md
HTTP/1.1 204 No Content
```

### CRUD

| Verb   | URI Pattern            | Controller#Action            |
|--------|------------------------|------------------------------|
| POST   | `/reviews`             | `users#CreateReview`         |
| GET    | `/reviews`             | `users#ViewAllReviews`       |
| GET    | `/reviews/users/:user` | `users#ViewReviewsByOneUser` |
| GET    | `/reviews/:id`         | `users#ViewOneReview`        |
| GET    | `/reviews/items/:item` | `users#ViewReviewsOfOneItem` |
| PATCH  | `/reviews/:id`         | `users#UpdateReview`         |
| DELETE | `/reviews/:id`         | `users#DestroyReview`        |

#### POST /reviews

Request:

```sh
curl "https://mcdennis-review-board.herokuapp.com/reviews" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $TOKEN" \
  --data '{
    "review": {
      "item": "McBlurry",
      "title": "Title Of The Review",
      "body": "Body Of The Review"
    }
  }'
```

```sh
curl-scripts/reviews/create.sh
```

Response:

```md
TP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "review":{
    "_id":"60988d0f7e39ba00153ea5d6",
    "item":"McBlurry",
    "title":"Title Of The Review",
    "body":"Body Of The Review",
    "owner":"60988ca97e39ba00153ea5d5",
    "ownerEmail":"an@example.email",
    "createdAt":"2021-05-10T01:31:59.280Z",
    "updatedAt":"2021-05-10T01:31:59.280Z",
    "__v":0
  }
}
```

#### GET /reviews

Request:

```sh
curl "https://mcdennis-review-board.herokuapp.com/reviews" \
  --include \
  --request GET
```

```sh
curl-scripts/reviews/index.sh
```

Response:

```md
TP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "reviews":{
    [
      {
        "_id":"60988d0f7e39ba00153ea5d6",
        "title":"Title Of The Review",
        "item":"McBlurry",
        "body":"Body Of The Review",
        "owner":"60988ca97e39ba00153ea5d5",
        "ownerEmail":"an@example.email",
        "createdAt":"2021-05-10T01:31:59.280Z",
        "updatedAt":"2021-05-10T01:31:59.280Z",
        "__v":0
      },
      {
        "_id":"608725c51e50c400156cb973",
        "title":"borger",
        "item":"Big_Den",
        "body":"medium rare borger",
        "owner":"608725ad1e50c400156cb972",
        "ownerEmail":"borgerlover@ga",
        "createdAt":"2021-04-26T20:42:45.559Z",
        "updatedAt":"2021-04-26T20:42:45.559Z",
        "__v":0
      }
    ]
  }
}
```

#### GET /reviews/users/:user

Request:

```sh
curl "https://mcdennis-review-board.herokuapp.com/reviews/users/$USER_ID" \
  --include \
  --request GET
```

```sh
curl-scripts/reviews/index_user.sh
```

Response:

```md
TP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "reviews":{
    [
      {
        "_id":"608725c51e50c400156cb973",
        "title":"borger",
        "item":"Big_Den",
        "body":"medium rare borger",
        "owner":"608725ad1e50c400156cb972",
        "ownerEmail":"borgerlover@ga",
        "createdAt":"2021-04-26T20:42:45.559Z",
        "updatedAt":"2021-04-26T20:42:45.559Z",
        "__v":0
      },
      {
        "_id":"608725e61e50c400156cb974",
        "title":"big borger",
        "item":"Half_Pounder",
        "body":"example text example text example text example text example text",
        "owner":"608725ad1e50c400156cb972",
        "ownerEmail":"borgerlover@ga",
        "createdAt":"2021-04-26T20:43:18.194Z",
        "updatedAt":"2021-04-26T20:43:18.194Z",
        "__v":0
      }
    ]
  }
}
```

#### GET /reviews/:id

Request:

```sh
curl "https://mcdennis-review-board.herokuapp.com/reviews/$ID" \
  --include \
  --request GET
```

```sh
curl-scripts/reviews/show.sh
```

Response:

```md
TP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "review":{
    "_id":"60988d0f7e39ba00153ea5d6",
    "item":"McBlurry",
    "title":"Title Of The Review",
    "body":"Body Of The Review",
    "owner":"60988ca97e39ba00153ea5d5",
    "ownerEmail":"an@example.email",
    "createdAt":"2021-05-10T01:31:59.280Z",
    "updatedAt":"2021-05-10T01:31:59.280Z",
    "__v":0
  }
}
```

#### GET /reviews/items/:item

Request:

```sh
curl "https://mcdennis-review-board.herokuapp.com/reviews/items/$ITEM" \
  --include \
  --request GET
```

```sh
curl-scripts/reviews/index_item
```

Response:

```md
TP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "reviews":{
    [
      {
        "_id":"608725c51e50c400156cb973",
        "title":"borger",
        "item":"Big_Den",
        "body":"medium rare borger",
        "owner":"608725ad1e50c400156cb972",
        "ownerEmail":"borgerlover@ga",
        "createdAt":"2021-04-26T20:42:45.559Z",
        "updatedAt":"2021-04-26T20:42:45.559Z",
        "__v":0
      },
      {
        "_id":"608726c81e50c400156cb978",
        "title":"Good Ol' Fashioned Burger",
        "item":"Big_Den",
        "body":"Just like mama used to make.",
        "owner":"608726021e50c400156cb975",
        "ownerEmail":"foodie@ga",
        "createdAt":"2021-04-26T20:47:04.669Z",
        "updatedAt":"2021-04-26T20:47:04.669Z",
        "__v":0
      }
    ]
  }
}
```

#### PATCH /reviews/:id

Request:

```sh
curl "https://mcdennis-review-board.herokuapp.com/reviews/$ID" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $TOKEN" \
  --data '{
      "review": {
        "item": "Big_Den",
        "title": "New Title",
        "body": "New Body"
      }
    }'
```

```sh
curl-scripts/reviews/update.sh
```

Response:

```md
TP/1.1 204 No Content
```

#### DELETE /reviews/:id

Request:

```sh
curl "https://mcdennis-review-board.herokuapp.com/reviews/$ID" \
  --include \
  --request DELETE
  --header "Authorization: Bearer $TOKEN"
```

```sh
curl-scripts/reviews/destroy.sh
```

Response:

```md
TP/1.1 204 No Content
```

## [License](LICENSE)

1. All content is licensed under a CC­BY­NC­SA 4.0 license.
1. All software code is licensed under GNU GPLv3. For commercial use or
    alternative licensing, please contact legal@ga.co.
