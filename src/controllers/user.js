const Token = require('../models/token');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const url = require('url');

const User = require('../models/user');
const Group = require('../models/group');

function createToken(user) {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, {
        expiresIn: 1200000
    })
}

exports.registerUser = (req, res) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({'msg': 'You need to send email and password'});
    }

    User.findOne({ email: req.body.email}, (err, user) => {
        if (err) {
            return res.status(400).json({'msg': err});
        }

        if (user) {
            if (user.isAdded === true) {
                let addedUser = req.body;
                addedUser.save((err, user) => {
                    if(err) {
                        return res.status(400).json({'msg': err});
                    }
        
                    var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
                    token.save((err) => {
                        if(err) {
                            return res.status(400).json({'msg': err});
                        }
        
                        var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: config.user, pass: config.pass } });
                        const mailOptions = {
                             from: 'prafullsakpal15898@gmail.com',
                             to: user.email,
                             subject: 'Account Verification',
                             text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/confirmation?token=' + token.token + '.\n'
                        };
                        transporter.sendMail(mailOptions, (err) => {
                            if (err) {
                                return res.status(400).json({'msg': err});
                            }
                            return res.status(200).json('A verification email has been sent to ' + user.email + '.');
                        });
                    });
                });
            }
            else {
                return res.status(400).json({'msg': 'User already exists'});
            }
        }

        let newUser = User(req.body);
        // newUser.save((err, user) => {
        newUser.save((err, user) => {
            if(err) {
                return res.status(400).json({'msg': err});
            }

            var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            token.save((err) => {
                if(err) {
                    return res.status(400).json({'msg': err});
                }

                var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: config.user, pass: config.pass } });
                const mailOptions = {
                     from: 'prafullsakpal15898@gmail.com',
                     to: user.email,
                     subject: 'Account Verification',
                     text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/confirmation?token=' + token.token + '.\n'
                };
                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        return res.status(400).json({'msg': err});
                    }
                    return res.status(200).json('A verification email has been sent to ' + user.email + '.');
                });
            });
            //return res.status(200).json(user);
        });
    });
};

exports.loginUser = (req, res) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({'msg': 'You need to send email and password!'});
    }

    User.findOne({ email: req.body.email}, (err, user) => {
        if (err) {
            return res.status(400).json({'msg': err});
        }

        if (!user) {
            return res.status(400).json({'msg': 'User does not exist!'});
        }

        if (user && !user.isVerified) {
            return res.status(403).json({'msg': 'Email Id is not verified!'});
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if(isMatch && !err) {
                return res.status(200).json({
                    token: createToken(user)
                })
            }
            else if(!user.isVerified) {
                return res.status(401).json({
                    msg: 'Your account is not verified!'
                })
            }
            else {
                return res.status(400).json({
                    msg: 'Wrong password!'
                })
            }
        });
    });
};

exports.confirmationGet = function (req, res) {
    // Find a matching token
    let queryObject = url.parse(req.url, true).query;
    let token = queryObject['token'];
    Token.findOne({ token: token }, function (err, token) {
        if (!token) {
            return res.status(400).json({ 'msg': 'We were unable to find a valid token. Your token my have expired.' });
        }
 
        // If we found a token, find a matching user
        User.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return res.status(400).json({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).json({ type: 'already-verified', 'msg': 'This user has already been verified.' });
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).json({ msg: err.message }); }
                res.status(200).json("The account has been verified. Please log in.");
            });
        });
    });
};

exports.resendTokenGet = function (req, res, next) {
 
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
            return res.status(400).json({ msg: 'We were unable to find a user with that email.' });
        };
        if (user.isVerified) {
            return res.status(400).json({ msg: 'This account has already been verified. Please log in.' });
        } 
 
        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
 
        // Save the token
        token.save(function (err) {
            if (err) { 
                return res.status(500).json({ msg: err.message }); 
            }
 
            // Send the email
            var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: config.user, pass: config.pass } });
            var mailOptions = { 
                from: 'prafullsakpal15898@gmail.com', 
                to: user.email, 
                subject: 'Account Verification', 
                text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/confirmation?token=' + token.token + '.\n' 
            };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { 
                    return res.status(500).json({ msg: err.message }); 
                }
                return res.status(200).json('A verification email has been sent to ' + user.email + '.');
            });
        });
 
    });
};

exports.userDetails = function(req, res) {
    let queryObject = url.parse(req.url, true).query;
    let userid = queryObject['userid'];
    User.findById(userid)
        .select('_id email role')
        .then(user => {
            Group.find({ 'subgroups.members' : user.email })
                .select('_id subgroups._id')
                .then(groups => {
                    let userDetails = {
                        id: user._id,
                        email: user.email,
                        role: user.role
                    };
                    userDetails = {...userDetails, groups}
                    res.json({ userDetails: userDetails });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}