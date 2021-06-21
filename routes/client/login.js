const express = require('express')
const router = express.Router();
const passport = require('../../config/passport-config');
const {body, validationResult} = require('express-validator');

router.get('/', function(req, res) {
    const title = "Home"
    res.render('landing', {title});
});

router.get('/login', function(req, res) {
    const login_errors = req.flash('login_error');
    const register_errors = req.flash('register_error');
    const title = "Login"
    console.log(login_errors);
    console.log(register_errors);
    return res.render('login', {title, login_errors, register_errors});
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), (req, res) => {
    return res.redirect('/dashboard')
})

router.post('/register', body('password').isLength({ min: 5 }),  async (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            console.log(errors);
            const errorMessage = []
            errors.array().map(err => errorMessage.push({[err.param]: err.msg}))
            console.log(errorMessage);
            req.flash('register_error', errorMessage)
            return res.redirect('/login'); 

        }

        console.log(req.body);
    } catch (err) {
        console.log(err);
        return err
    }
    
})

module.exports = router 