var express = require('express');
// const app = require('../app.js');
var router = express.Router();
const { requireAuth } = require('../auth.js');
const { check, validationResult } = require('express-validator');
const { csrfProtection, asyncHandler, reviewValidator } = require('../utils.js');
const db = require('../db/models');
const { Game, Review, GameCleanRating, Shelf, User, ReviewLike } = db;
// router.use(requireAuth); this applies to all routes, but we only want it for certain paths

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  const allGames = await Game.findAll();
  res.render('games', { title: 'Game List', games: allGames });
}));

router.get('/:id(\\d+)', csrfProtection, asyncHandler(async (req, res, next) => {
  const reviewId = parseInt(req.params.id, 10);
  const currentUser = req.session.auth.userId;
  const reviewLike = await ReviewLike.findAll({
    where: {reviewId}
  });

  const totalLikes = reviewLike.length;
  // console.log(`--------------->>>>>${totalLikes}`);
  // console.log(`--------------->>>>>${reviewLike}`);
  // console.log(`--------------->>>>>${reviewId}`);

  const gameId = req.params.id;

  const games = await Game.findByPk(gameId, {
    include: [{model: Review, include: [ReviewLike, User]}, GameCleanRating, Shelf]
  })

  console.log(games.Reviews);
  const reviews = games.Reviews

  const reviewNames = await Review.findAll(
    {where: {
      gameId: req.params.id
    },
    include: User
  });

  res.render('game-page', {title: games.title, games, reviews, reviewId, gameId, userId: currentUser, reviewNames, totalLikes, token: req.csrfToken()})
}))

router.post('/:id(\\d+)', csrfProtection, reviewValidator, requireAuth, asyncHandler(async(req, res, next) => {
  const gameId = req.params.id;
  const {title, content} = req.body;
  const userId = res.locals.user.id
  const games = await Game.findByPk(gameId, {
    include: [Review, GameCleanRating, Shelf]
  })
  const reviews = games.Reviews

  const reviewNames = await Review.findAll(
    {where: {
      gameId: req.params.id
    },
    include: User
  });

  let errors = [];
  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    const user = {
      userId,
      title: '',
      content,
      gameId
    }
    console.log(user);
    await Review.create(user);
    res.redirect(`/games/${gameId}`);
  } else {
    console.log("Error creating review");
    errors = validatorErrors.array().map((error) => error.msg);
    res.render('game-page', {title: games.title, games, reviews, reviewNames, errors, token: req.csrfToken()})
    // const user = User.build();
  }
  console.log('---------------------------------------------------------------------------')
  console.log(errors);

  // res.redirect(`/games/${gameId}`)
}));

//gets data and sends back to dom file
router.post('/:id(\\d+)/:reviewId', asyncHandler(async(req, res, next) => {
  const reviewId = parseInt(req.params.reviewId, 10);
  const allLikes = await ReviewLike.findAll({
    where: {reviewId}
  });
  const currentUser = req.session.auth.userId;
  const reviewLike = await ReviewLike.findOne({
    where: {reviewId, userId: currentUser}
  });
  if (reviewLike){
      await reviewLike.destroy();
  } else {
    await ReviewLike.create({
      like: true,
      reviewId,
      userId: currentUser
    });
  }
  const totalLikes = allLikes.length;
  console.log('TOTAL LIKES -------------')
  console.log(totalLikes);
  res.json({totalLikes, reviewId})
}));



module.exports = router;
