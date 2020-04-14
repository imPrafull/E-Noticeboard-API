const Group = require('../models/group');

exports.getGroups = (req, res) => {
    const groups = Group.find()
        .populate('createdBy', '-_id email')
        .populate('subgroups.members', '-_id email')
        .select('_id name createdBy subgroups createdAt updatedAt')
        .then(groups => {
            res.json({ groups: groups })
        })
        .catch(err => console.log(err));
}

exports.createGroup = (req, res) => {
    const group = new Group(req.body);
    // group.members.push(req.body.createdBy);
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
    Group.findByIdAndUpdate(req.body.id, { $push: { subgroups: req.body.subgroups } }, {new: true})
        .then(group => {
            res.status(200).json({
                group: group
            });
        })
        .catch(err => console.log(err));
}

exports.updateSubgroup = (req, res) => {
    Group.findOneAndUpdate({'_id': req.body.groupId, 'subgroups._id': req.body.subgroupId}, { $push: { 'subgroups.$.members': req.body.member } }, {new: true})
        .then(group => {
            res.status(200).json({
                group: group
            });
        })
        .catch(err => console.log(err));
}

