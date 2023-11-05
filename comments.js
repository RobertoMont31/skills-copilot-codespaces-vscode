// Create web server
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Post = require('../models/post');
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// // GET request handler for /comments
router.get('/', function(req, res) {
    // Find all comments in db
    Comment.find({}, function(err, comments) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/index', {comments: comments});
        }
    });
});

// GET request handler for /comments/new
router.get('/new', isLoggedIn, function(req, res) {
    // Render new comment page
    res.render('comments/new');
});

// POST request handler for /comments
router.post('/', isLoggedIn, function(req, res) {
    // Create new comment in db
    Comment.create(req.body.comment, function(err, comment) {
        if (err) {
            console.log(err);
        } else {
            // Add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            // Save comment
            comment.save();
            // Add comment to post
            Post.findById(req.body.postId, function(err, post) {
                if (err) {
                    console.log(err);
                } else {
                    post.comments.push(comment);
                    post.save();
                    // Redirect to post show page
                    res.redirect('/posts/' + req.body.postId);
                }
            });
        }
    });
});

// GET request handler for /comments/:id/edit
router.get('/:id/edit', checkCommentOwnership, function(req, res) {
    // Find comment in db
    Comment.findById(req.params.id, function(err, comment) {
        if (err) {
            console.log(err);
        } else {
            // Render edit comment page
            res.render('comments/edit', {comment: comment});
        }
    });
});

// PUT request handler for /comments/:id
router.put('/:id', checkCommentOwnership, function(req, res) {
    // Find and update comment in db
    Comment.findByIdAndUpdate(req.params.id, req.body.comment, function(err, comment) {
        if (err) {
            console.log(err);
        } else {
            // Redirect to comment show page
            res.redirect('/comments/' + req.params.id);