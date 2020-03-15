exports.postValidator = (req, res, next) => {
    //title
    req.check('title', 'Enter a title').notEmpty();
    req.check('title', 'Email Id must be between 4 to 150 characters').isLength({
        min: 4,
        max: 150
    });
    //body
    req.check('body', 'Write a body').notEmpty();
    req.check('body', 'Body must be between 4 to 2000 characters').isLength({
        min: 4,
        max: 2000
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