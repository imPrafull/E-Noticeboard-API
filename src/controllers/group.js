const Group = require('../models/group');
const User = require('../models/user');

// get groups
exports.getGroups = (req, res) => {
    const groups = Group.find()
        .populate('createdBy', '-_id email')
        // .populate('subgroups.members', '-_id email')
        .populate('subgroups.createdBy', '-_id email')
        .select('_id name createdBy subgroups createdAt updatedAt')
        .then(groups => {
            res.json({ groups: groups })
        })
        .catch(err => console.log(err));
}

// create group
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
            if (err.code === 11000) {
                res.status(400).json({ 'msg': 'Group Name already exists!' });
            }
        });
}

// create subgroup
exports.createSubgroup = (req, res) => {
    Group.findOneAndUpdate({ _id: req.body.id, 'subgroups.name': { $ne: req.body.subgroup.name } }, { $addToSet: { subgroups: req.body.subgroup } }, { new: true })
        .then(group => {
            if (group == null) {
                res.status(400).json({ 'msg': 'Subgroup Name already exists!' });
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

// add member
exports.updateSubgroup = (req, res) => {
    Group.findOne({ '_id': req.body.groupId }).then(group => {
        let subgroups = []
        if (req.body.memberId) {
            subgroups = group.subgroups.map(subgroup => {
                if (subgroup._id == req.body.subgroupId) {
                    subgroup.members.findIndex(member => member == req.body.memberId) == -1 ? subgroup.members.push(req.body.memberId) : res.status(200).json({ msg: 'Member Already Exists' });
                }
                return subgroup;
            });
            group.set('group.subgroups', subgroups);
            group.save()
                .then(group => res.status(200).json({ msg: 'Member Added' }))
                .catch(err => console.log(err));
        }
        else if (req.body.memberEmail) {
            User.findOne({ email: req.body.memberEmail }, (err, user) => {
                if (err) {
                    console.log('add user ', err, user)
                    return res.status(400).json({ 'msg': err });
                }

                if (user && user.isAdded) return res.status(200).json({ msg: 'Member Already Exists' });

                if (user && !user.isAdded) {
                    subgroups = group.subgroups.map(subgroup => {
                        if (subgroup._id == req.body.subgroupId) {
                            subgroup.members.includes(user._id) ? res.status(200).json({ msg: 'Member Already Exists' }) : subgroup.members.push(user._id);
                        }
                        return subgroup;
                    });
                    group.set('group.subgroups', subgroups);
                    group.save()
                        .then(group => res.status(200).json({ msg: 'Member Added' }))
                        .catch(err => console.log(err));
                } else {
                    let newUser = User({ email: req.body.memberEmail, isAdded: true });
                    newUser.save((err, user) => {
                        if (err) {
                            console.log('add user ', err, user)
                            return res.status(400).json({ 'msg': err });
                        }
                        subgroups = group.subgroups.map(subgroup => {
                            if (subgroup._id == req.body.subgroupId) {
                                subgroup.membersToBe.includes(req.body.memberEmail) ? res.status(200).json({ msg: 'Member Already Exists' }) : subgroup.membersToBe.push(req.body.memberEmail);
                            }
                            return subgroup;
                        });
                        group.set('group.subgroups', subgroups);
                        group.save()
                            .then(group => res.status(200).json({ msg: 'Member Added' }))
                            .catch(err => console.log(err));
                    });
                }
            });
        }
    })
}                     