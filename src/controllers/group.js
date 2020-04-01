const Group = require('../models/group');

exports.getGroups = (req, res) => {
    const groups = Group.find()
        .populate('createdBy', '-_id email')
        .populate('members', '-_id email')
        .select('_id name createdBy members createdAt updatedAt')
        .then(groups => {
            res.json({ groups: groups })
        })
        .catch(err => console.log(err));
}

exports.createGroup = (req, res) => {
    const group = new Group(req.body);
    group.members.push(req.body.createdBy);
    group.save()
        .then(group => {
            res.status(200).json({
                group: group
            });
        })
        .catch(err => {
            if (err.code === 11000){
                res.status(400).json({'msg': 'Group Name already exists!'});
            }
        });
}
