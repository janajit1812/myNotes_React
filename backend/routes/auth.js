const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser');
const JWT_STRING="CR7isthetrueGOAT"; // The unique string used to create the digital signature portion of the web token.

// ROUTE 1: Create a User using POST: /api/auth/createUser. No login required.
router.post('/createUser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {

    // If there are errors, then we have to return bad request the errors.
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success=false;
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            success=false;
            return res.status(400).json({ success, error: "Given email ID already exists" });
        }

        // Creating a new User.
        const salt= await bcrypt.genSalt(10); // Used to create the salt portion of the password .
        const securePassword= await bcrypt.hash(req.body.password,salt); // Creates a hash of the password which will be stored in the database.

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePassword,
        })

        // This will be the unique data (here it is their ID as per which they are stored in the database) acc. to which digital signature will be created.
        const data={
            user:{
                id: user.id
            }
        }
        const authenticationToken=jwt.sign(data,JWT_STRING);  // This creates the digital signature required in the authentication token.
        success=true;
        res.json({success,authenticationToken});
        // console.log(authenticationToken);
        // res.json(user);
        // .then(user => res.json(user)).catch((err)=>{console.log(err); res.json("Please put an unique email ID.")});
    }
    // Catching errors if any occured.
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})



// ROUTE 2: Authenticate a user using POST: /api/auth/login . No login is required.
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {

    let success=false;
    // If there is an error, return bad request and the error.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email,password}=req.body; // Array destructuring

    try {
        let user=await User.findOne({email});
        if(!user){
            success=false;
            return res.status(400).json({error: "Please enter the correct credentials."});
        }
        const passwordComapare=await bcrypt.compare(password,user.password);
        if(!passwordComapare){
            success=false;
            return res.status(400).json({success,error: "Please enter the correct credentials."});
        }
        const data={
            user:{
                id: user.id
            }
        }
        const authenticationToken=jwt.sign(data,JWT_STRING);  // This creates the digital signature required in the authentication token.
        success=true;
        res.json({success,authenticationToken});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})





// ROUTE 3: Get the user logged in details using POST: /api/auth/getUser. Login is required.
router.post('/getUser',fetchuser, async (req, res) => {
    try {
        const userid=req.user.id;
        const user =await User.findById(userid).select("-password");
        res.send(user);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

module.exports = router;