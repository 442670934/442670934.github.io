var express = require('express');
var router = express.Router();
router.get('/main/admin-login', function(req, res, next) {
        res.render('main/admin-login');
});
router.get(['/main/index','/index','/'], function(req, res, next) {
        res.render('main/index');
});
router.get('/main/login', function(req, res, next) {
        res.render('main/login');
});
router.get('/main/register', function(req, res, next) {
        res.render('main/register');
});
router.get('/main/user', function(req, res, next) {
        res.render('main/user');
});
router.get('/main/content', function(req, res, next) {
        res.render('main/content');
});
router.get('/main/editor', function(req, res, next) {
        res.render('main/editor');
});
module.exports = router;