exports.groupValidator = (req, res, next) => {
    //name
    req.check('name', 'Enter a Name').notEmpty();
    req.check('name', 'Group Name must be between 4 to 150 characters').isLength({
        min: 4,
        max: 250
    }); 
    // created by
    req.check('createdBy', 'Created by cannot be empty').notEmpty();

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