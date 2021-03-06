// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for reviews
const Review = require('../models/review')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { review: { title: '', text: 'foo' } } -> { review: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// This file contains an array of the items that users can leave a review of
const menuItems = require('../../lib/menu_items')

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /reviews
router.get('/reviews', (req, res, next) => {
  Review.find()
    .then(reviews => {
      // `reviews` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return reviews.map(review => review.toObject())
    })
    // respond with status 200 and JSON of the reviews
    .then(reviews => res.status(200).json({ reviews: reviews }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// INDEX USER
// GET /reviews/users/5a7db6c74d55bc51bdf39793
router.get('/reviews/users/:user', (req, res, next) => {
  Review.find({ owner: req.params.user })
    .then(reviews => {
      // `reviews` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return reviews.map(review => review.toObject())
    })
    // respond with status 200 and JSON of the reviews
    .then(reviews => res.status(200).json({ reviews: reviews }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /reviews/5a7db6c74d55bc51bdf39793
router.get('/reviews/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Review.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "review" JSON
    .then(review => res.status(200).json({ review: review.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW ITEM
// GET /reviews/items/McBlurry
router.get('/reviews/items/:item', (req, res, next) => {
  Review.find({ item: req.params.item })
    .then(reviews => {
      // `reviews` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return reviews.map(review => review.toObject())
    })
    // respond with status 200 and JSON of the reviews
    .then(reviews => res.status(200).json({ reviews: reviews }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /reviews
router.post('/reviews', requireToken, (req, res, next) => {
  // check if the review item is on the menu
  if (!menuItems.includes(req.body.review.item)) {
    throw new Error('That item isn\'t on the menu!')
  }
  // set owner of new review to be current user
  req.body.review.owner = req.user.id
  req.body.review.ownerEmail = req.user.email
  Review.create(req.body.review)
    // respond to succesful `create` with status 201 and JSON of new "review"
    .then(review => {
      res.status(201).json({ review: review.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /reviews/5a7db6c74d55bc51bdf39793
router.patch('/reviews/:id', requireToken, removeBlanks, (req, res, next) => {
  // check if the review item is on the menu
  if (!menuItems.includes(req.body.review.item)) {
    throw new Error('That item isn\'t on the menu!')
  }
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.review.owner

  Review.findById(req.params.id)
    .then(handle404)
    .then(review => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, review)

      // pass the result of Mongoose's `.update` to the next `.then`
      return review.updateOne(req.body.review)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /reviews/5a7db6c74d55bc51bdf39793
router.delete('/reviews/:id', requireToken, (req, res, next) => {
  Review.findById(req.params.id)
    .then(handle404)
    .then(review => {
      // throw an error if current user doesn't own `review`
      requireOwnership(req, review)
      // delete the review ONLY IF the above didn't throw
      review.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// // DESTROY ALL REVIEWS UNAUTHORIZED
// // THIS IS FOR DEVELOPMENT ONLY!!!!
// router.delete('/reviews', (req, res, next) => {
//   Review.find()
//     .then(handle404)
//     .then(reviews => {
//       reviews.forEach(review => review.deleteOne())
//     })
//     // send back 204 and no content if the deletion succeeded
//     .then(() => res.sendStatus(204))
//     // if an error occurs, pass it to the handler
//     .catch(next)
// })

module.exports = router
