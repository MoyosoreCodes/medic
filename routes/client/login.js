const express = require('express')
const router = express.Router();
const passport = require('../../config/passport-config');
const {body, validationResult} = require('express-validator');
const userServices = require('../../services/userServices');
const { user_types } = require('../../model/userModel');


const authUser = (req, res, next) => {
    if(req.isAuthenticated()){
        next()
    }
    else {
        return res.status(401).redirect('/login')
    }
}
//middleware
/*
const validations = [       
    body('firstname')
        .isLength({min:1})
        .withMessage('Firstname is required'),
    body('lastname')
        .isLength({min:1})
        .withMessage('Lastname is required'), 
    body('password')
        .isLength({min: 6})
        .withMessage('Password length is 6 characters long'),
    body('email')
        .isEmail()
        .custom( async (email) => {
            const user = await Users.findOne({email});
            if (user){
                throw new Error('Email has been registered');
            }
        })
        .withMessage('invalid email')
];
*/
router.get('/', function(req, res) {
    const title = "Home"
    res.render('landing', {title});
});

router.get('/login', function(req, res) {
    const errors = req.flash('error') || [];
    //console.log(errors);
    const title = "Login"
    return res.render('login', {title, errors});
});

router.post('/login', passport.authenticate('local', 
        {failureRedirect: '/login', failureFlash: true, successRedirect:'/dashboard'}
    )
);

router.post('/register',  async (req, res) => {
    try {
        //console.log(req.body);
        const user_type = { 'user_type' : 'PATIENT'}
        Object.assign(req.body, user_type)
        //console.log(req.body);
        const newUser = await userServices.addUser(req.body)
        if(!newUser){
            return res.json({'error': " errror creating user", })
        }
        //console.log(newUser);
        return res.redirect('/login')
    } catch (error) {
        return error
    }
        
})

router.get('/dashboard', authUser, (req, res) => {
    if(req.user.user_type.toLowerCase() === user_types.PATIENT.toLowerCase()){
        return res.render('profile', {title:`${req.user.first_name}`, user: req.user})
    }
    else {
        return res.json({message: "You are now in the doctor dashboard"})
    }
})
module.exports = router 