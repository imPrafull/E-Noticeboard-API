const Group = require('../models/group');
const User = require('../models/user');

exports.getGroups = (req, res) => {
    const groups = Group.find()
        .populate('createdBy', '-_id email')
        .populate('subgroups.members', '-_id email')
        .populate('subgroups.createdBy', '-_id email')
        .select('_id name createdBy subgroups createdAt updatedAt')
        .then(groups => {
            res.json({ groups: groups })
        })
        .catch(err => console.log(err));
}

exports.createGroup = (req, res) => {
    const group = new Group(req.body);
    group.save()
        .then(group => {
            group.populate('createdBy', '-_id email')
                .execPopulate().then(group => {
                    res.status(200).json({
                    group: group
                });
            });
        })
        .catch(err => {
            if (err.code === 11000){
                res.status(400).json({'msg': 'Group Name already exists!'});
            }
        });
}

exports.createSubgroup = (req, res) => {
    Group.findOneAndUpdate({_id: req.body.id, 'subgroups.name': {$ne: req.body.subgroups.name}}, { $addToSet: { subgroups: req.body.subgroups } }, {new: true})
        .then(group => {
            if (group == null) {
                res.status(400).json({'msg': 'Subroup Name already exists!'});
                return;
            }
            group.populate('createdBy', '-_id email')
                .populate('subgroups.createdBy', '-_id email')
                .populate('subgroups.members', '-_id email')
                .execPopulate().then(group => {
                    res.status(200).json({
                    group: group
                });
            });

        })
        .catch(err => console.log(err));
}

exports.updateSubgroup = (req, res) => {
    Group.findOneAndUpdate({'_id': req.body.groupId, 'subgroups._id': req.body.subgroupId, 'subgroups.members': {$nin: req.body.member}}, { $addToSet: { 'subgroups.$.members': req.body.member } }, {new: true})
        .then(group => {
            if (group == null) {
                res.status(400).json({'msg': 'Member already exists'});
            }

            User.findOne({ email: req.body.member}, (err, user) => {
                if (err) {
                    return res.status(400).json({'msg': err});
                }
        
                if (user) {
                    return res.status(400).json({'msg': 'User already exists'});
                }

                let newUser = User({email: req.body.member, isAdded: true});
                newUser.save((err, user) => {
                    if(err) {
                        return res.status(400).json({'msg': err});
                    }
                    res.status(200).json({
                        group: group
                    });
                });
            });

        })
        .catch(err => console.log(err));
}

