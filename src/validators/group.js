exports.groupValidator = (req, res, next) => {
    //name
    req.check('name', 'Enter a Name').notEmpty();
    req.check('name', 'Group Name must be between 1 to 150 characters').isLength({
        min: 1,
        max: 150
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