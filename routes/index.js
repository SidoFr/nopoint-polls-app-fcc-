const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');
const userController = require('../controllers/userController');
const { catchErrors } = require('../modules/errorHandlers');
const passport = require('passport');

router.get('/', controllers.homepage);
router.get('/polls', controllers.polls);

router.get('/register', userController.registerForm);
router.post(
    '/register',
    userController.validateRegister,
    userController.register);

router.get('/login', userController.loginForm);
router.post('/login', userController.login);

// redirect for auth with fb or twitter
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/twitter', passport.authenticate('twitter'));
// when fb or twitter redirect to callback url after approval
// end of process: get token/ auth success or failure
router.get('/auth/facebook/callback', userController.facebook);
router.get('/auth/twitter/callback', userController.twitter);

router.get('/logout', userController.logout);

router.get('/my-polls', userController.isLoggedIn, catchErrors(controllers.account));
router.get('/create-poll', userController.isLoggedIn, controllers.createPoll);

router.post('/create-poll', catchErrors(controllers.sendPoll));

router.get('/poll/:slug', catchErrors(controllers.getPoll));
router.post(
    '/poll/:slug',
    catchErrors(userController.hasVoted),
    controllers.vote,
    catchErrors(controllers.getPoll));

router.get('/poll/:slug/edit', catchErrors(controllers.editPoll));
router.post('/poll/:slug/edit', catchErrors(controllers.saveEdit));
router.get('/poll/:slug/delete', catchErrors(controllers.delete));


module.exports = router;