const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const fbCb = '/auth/facebook/callback';
const TwitterCb = '/auth/twitter/callback';
const Local = require('../models/Local');
const Auth = require('../models/Auth');

// Configure passport-local to use account model for authentication
passport.use(Local.createStrategy());

// authentication with facebook & twitter
passport.use(new FacebookStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: `${process.env.APP_URL}${fbCb}`,
  },   
  function(req, accessToken, profile, done) {
    Auth.findOne({ 'facebook.id': profile.id }, (err, user) => {
        if(err) {
            // console.log('error:' + err);
            done(err);
        }
        if (user)
            {
                // console.log('FB user exists: ' + user)
                done(null, user);
            }
        else {
            const facebookUser = new Auth();
            facebookUser.facebook.id = profile.id;
            facebookUser.facebook.token = accessToken;
            facebookUser.facebook.name = profile.displayName;
            facebookUser.save(((err) => {
                if(err ){
                    // console.log('err: ' + err);
                    done(err);
                }
                done(null, facebookUser);
            }));
        }
    });
  }
));
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: `${process.env.APP_URL}${TwitterCb}`,
  },
  function(req, accessToken, profile, done) {
    Auth.findOne({ 'twitter.id': profile.id }, (err, user) => {
        if(err) {
            // console.log('error:' + err);
            done(err);
        }
        if (user)
            {
                // console.log('Twitter user exists: ' +user)
                done(null, user);
            }
        else {
            const twitterUser = new Auth();
            twitterUser.twitter.id = profile.id;
            twitterUser.twitter.token = accessToken;
            twitterUser.twitter.name = profile.displayName;
            twitterUser.save(((err) => {
                if(err) {
                    // console.log('err: ' + err);
                    done(err);
                }
                done(null, twitterUser);
            }));  
        }
    });
  }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser((id, done) => {
    Auth.findById(id, (err, user) => {
        if (user) {
           done(err, user);
        }else {
            Local.findById(id, (err, user) => {
                done(err, user);
            });
        }
    });
});