const passport = require('passport');
const bcrypt=require('bcrypt');
const ObjectID = require('mongodb').ObjectID;
const LocalStrategy = require('passport-local');
const GitHubStrategy = require('passport-github').Strategy

module.exports = function (app, myDataBase) {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
        myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
        if (err) return console.error(err);
        done(null, doc);
        });
    });
    passport.use(new LocalStrategy(
        function (username, password, done) {
        myDataBase.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
            return done(null, user);
        });
        }
    ));

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'https://chat-app-dsxa.onrender.com/auth/github/callback'
      },
        function(accessToken, refreshToken, profile, cb) {
          console.log(profile);
          //Database logic here with callback containing our user object
        }
      ));
}