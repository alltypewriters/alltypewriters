 // app/routes.js
 module.exports = function(app, passport) {

     var User = require('./models/user');
     // ==================================================
     // HOME PAGE (with login links and register) ========
     // ==================================================
     app.get('/', function(req, res) {
         res.render('index.ejs', {
             message: req.flash('loginMessage'),
             message1: req.flash('signupMessage')
         });
     });

     // process the login form
     app.post('/login', passport.authenticate('local-login', {
         successRedirect: '/profile', // redirect to the secure profile section
         failureRedirect: '/', // redirect back to the signup page if there is an error
         failureFlash: true // allow flash messages
     }));

     // app.post('/login', do all our passport stuff here);

     // =====================================
     // SIGNUP ==============================
     // =====================================
     // show the signup form


     // process the signup form
     app.post('/signup', passport.authenticate('local-signup', {
         successRedirect: '/profile', // redirect to the secure profile section
         failureRedirect: '/', // redirect back to the signup page if there is an error
         failureFlash: true // allow flash messages
     }));


     // app.post('/signup', do all our passport stuff here);

     // =====================================
     // PROFILE SECTION =====================
     // =====================================
     // we will want this protected so you have to be logged in to visit
     // we will use route middleware to verify this (the isLoggedIn function)
     var Story = require('./models/story');

     Story.createStory = function(newFeature, callback) {
         newFeature.save(callback);
     }

     app.get('/profile', isLoggedIn, function(req, res) {
         res.render('profile.ejs', {
             user: req.user // get the user out of session and pass to template
         });
     });

     // =====================================
     // EDITOR SECTION ======================
     // =====================================
     // we will want this protected so you have to be logged in to visit
     // we will use route middleware to verify this (the isLoggedIn function)

     app.get('/profile/startastory', isLoggedIn, function(req, res) {
         res.render('editor.ejs')

     });
     // =====================================
     // USER_PROFILE SECTION =================
     // ======================================
     // we will want this protected so you have to be logged in to visit
     // we will use route middleware to verify this (the isLoggedIn function)

     app.get('/profile/:id', isLoggedIn, function(req, res) {
         User.find({ "_id": req.params.id }, function(err, user) {
             if (err) throw err;
             res.render('userprofile.ejs', {
                 username: user[0].facebook.name,
                 photo: user[0].facebook.photo

             });
         });
         /*res.render('userprofile.ejs', {
             user: req.user
         });*/
     });

     // =====================================
     // CATEGORY GET REQUESTS================
     // =====================================
     // we will want this protected so you have to be logged in to visit
     // we will use route middleware to verify this (the isLoggedIn function)
     app.get('/profile/cat/unsungheroes', isLoggedIn, function(req, res) {
         res.render('unsungheroes.ejs', {
             user: req.user
         });

     });
     app.get('/profile/cat/beyondheadlines', isLoggedIn, function(req, res) {
         res.render('beyondheadlines.ejs', {
             user: req.user
         });

     });
     app.get('/profile/cat/underthesun', isLoggedIn, function(req, res) {
         res.render('underthesun.ejs', {
             user: req.user
         });

     });



     // =====================================
     // SCHEMA LOADED (story) ===============
     // =====================================    

     // =====================================
     // POST A NEW STORY ====================
     // =====================================
     // var Story = require('./models/story');

     app.post('/profile/startastory', isLoggedIn, function(req, res) {
         /* Code for Author */
         if (req.user.facebook.name) {
             var author = req.user.facebook.name;
         } else if (req.user.google.name) {
             var author = req.user.google.name;
         } else {
             var author = req.user.local.name;
         }

         var category = req.body.category;
         var title = req.body.title;
         var body = req.body.body;
         var created_at = Date();
         var newStory = new Story({
             category: category,
             title: title,
             body: body,
             author: author,
             created_at: created_at
         });
         // save the story
         newStory.save(function(err) {
             if (err) throw err;
             console.log('Story Done!');
         });
         res.redirect('/profile');
     });

     //post request for submitting comment

     app.post('/:id/comment', isLoggedIn, function(req, res) {

         // update the story's comment sectiion

         backURL = req.header('Referer') || '/';
         if (req.user.facebook.name) {
             var comment_by = req.user.facebook.name;
         } else if (req.user.google.name) {
             var comment_by = req.user.google.name;
         } else {
             var comment_by = req.user.local.name;
         }

         var comment_message = req.body.comment;
         var comment_time = Date();

         var comment = {
             comment_message: comment_message,
             comment_time: comment_time,
             comment_by: comment_by
         };

         Story.update({ "_id": req.params.id }, { $push: { comments: comment } }, function(err, affected, resp) {
             console.log(resp);
         });



         res.redirect(backURL);


     });


     // ================================================
     // Route for JQuery Requests=======================
     // ================================================
     // This routes needs to be changed during deployment
     // =================================================
     app.get('/verified', function(req, res) {
         Story.find(function(err, story) {
             if (err) throw err;
             else {
                 res.json(story);
             }
         });
     });
     // ================================================
     // Page for single story(0.1)======================
     // ================================================
     // This needs to be changed, not efficient
     // =================================================
     app.get('/profile/unsungheroes/:id', function(req, res) {
         Story.find({ "_id": req.params.id }, function(err, story) {
             if (err) throw err;
             res.render('story.ejs', {
                 title: story[0].title,
                 body: story[0].body,
                 author: story[0].author,
                 user: req.user,
                 date: story[0].created_at,
                 id: story[0]._id,
                 comments: story[0].comments

             });
         });
     });

     app.get('/profile/beyondheadlines/:id', function(req, res) {
         Story.find({ "_id": req.params.id }, function(err, story) {
             if (err) throw err;
             //console.log(story[0].body)
             //var body_html = (story[0].body).replace("\n", "<br/>");
             //console.log(body_html)
             res.render('story.ejs', {
                 title: story[0].title,
                 body: story[0].body,
                 author: story[0].author,
                 date: story[0].created_at,
                 id: story[0]._id,
                 comments: story[0].comments
             });
         });
     });
     app.get('/profile/underthesun/:id', function(req, res) {
         Story.find({ "_id": req.params.id }, function(err, story) {
             if (err) throw err;
             res.render('story.ejs', {
                 title: story[0].title,
                 body: story[0].body,
                 author: story[0].author,
                 date: story[0].created_at,
                 id: story[0]._id,
                 comments: story[0].comments
             });
         });
     });


     // =====================================
     // FACEBOOK ROUTES =====================
     // =====================================
     // route for facebook authentication and login
     app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

     // handle the callback after facebook has authenticated the user
     app.get('/auth/facebook/callback',
         passport.authenticate('facebook', {
             successRedirect: '/profile',
             failureRedirect: '/'
         }));

     // =====================================
     // GOOGLE ROUTES =======================
     // =====================================
     // send to google to do the authentication
     // profile gets us their basic information including their name
     // email gets their emails
     app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

     // the callback after google has authenticated the user
     app.get('/auth/google/callback',
         passport.authenticate('google', {
             successRedirect: '/profile',
             failureRedirect: '/'
         }));
     // =====================================
     // LOGOUT ==============================
     // =====================================
     app.get('/logout', function(req, res) {
         req.logout();
         res.redirect('/');
     });
 };

 // route middleware to make sure a user is logged in
 function isLoggedIn(req, res, next) {

     // if user is authenticated in the session, carry on 
     if (req.isAuthenticated())
         return next();

     // if they aren't redirect them to the home page
     res.redirect('/');
 }
