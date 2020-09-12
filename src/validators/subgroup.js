exports.subgroupValidator = (req, res, next) => {
    // name
    req.check('subgroup.name', 'Enter a Name').notEmpty();
    req.check('subgroup.name', 'Group Name must be between 1 to 150 characters').isLength({
        min: 1,
        max: 100
    }); 
    // created by
    req.check('subgroup.createdBy', 'Created by cannot be empty').notEmpty();
    // id
    req.check('id', 'Enter an id').notEmpty();
    // members
    req.check('subgroup.members', 'members cannot be empty')
    
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

exports.memberValidator = (req, res, next) => {
    // groupId
    req.check('groupId', 'Enter a groupId').notEmpty();
    // subgroupId
    req.check('subgroupId', 'Enter a subgroupid').notEmpty();
    // member
    req.check('member', 'Enter a member email').notEmpty();
    
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

