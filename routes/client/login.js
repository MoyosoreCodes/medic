const express = require('express')
const router = express.Router();
const passport = require('../../config/passport-config');
//const {body, validationResult} = require('express-validator');
const userServices = require('../../services/userServices');
const userDB = require('../../database/userDB')
const userRecords = require('../../model/recordModel');
//const userController = require('../../controller/userController');


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
router.get('/',authUser, function(req, res) {
    const title = "Home"
    res.render('landing', {title});
});

router.get('/login',authUser, function(req, res) {
    const errors = req.flash('error') || [];
    //console.log(errors);
    const title = "Login"
    return res.render('login', {title, errors});
});

router.post('/login', authUser, passport.authenticate('local', 
        {failureRedirect: '/login', failureFlash: true, successRedirect:'/dashboard'}
    )
);

router.post('/register', authUser, async (req, res) => {
    try {
        //console.log(req.body);
        //const user_type = { 'user_type' : 'PATIENT'}
        //Object.assign(req.body, user_type)
        //console.log(req.body);
        const newUser = await userServices.addUser(req.body)
        if(!newUser){
            return res.json({'error': " errror creating user", })
        }
        console.log(newUser);
        return res.redirect('/login')
    } catch (error) {
        return error
    }
        
})

router.get('/dashboard', authUser, async (req, res) => {
    //console.log(req.session);
    //console.log(req.session.user);
    const _id =  req.session.passport.user;
    const user = await userDB.User.findOne({_id})
    const record = await userRecords.Records.findOne({patientId: _id})

    return res.render('profile', { user, record })
})
module.exports = router 