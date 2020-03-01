exports.authValidator = (req, res, next) => {
    //email
    req.check('email', 'Enter an email Id').notEmpty();
    req.check('email', 'Email Id must be between 10 to 150 characters').isLength({
        min: 10,
        max: 150
    });
    //password
    req.check('password', 'Write a body').notEmpty();
    req.check('password', 'Body must be between 6 to 50 characters').isLength({
        min: 6,
        max: 50
    });
    //check for errors
    const errors = req.validationErrors();
    //if error occur then show the first one as appears
    if(errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: firstError});
    }
    //proceed to next anyway
    next();
};