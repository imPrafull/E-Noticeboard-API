const Post = require('../models/post');
const url = require('url');

exports.getPosts = (req, res) => {
    let queryObject = url.parse(req.url, true).query;
    let {groupIds, subgroupIds} = queryObject;
    groupIds = groupIds.split(',');
    subgroupIds = subgroupIds.split(',');
    const posts = Post.find({
        $or: [{ 'groupId': { $in: groupIds } }, { 'subgroupId': { $in: subgroupIds } }]
    })
        .populate('createdBy', '-_id email')
        .select('_id title body createdBy createdAt updatedAt')
        .then(posts => {
            res.json({ posts: posts })
        }) 
        .catch(err => console.log(err));
}

exports.createPost = (req, res) => {
    const post = new Post(req.body);
    post.save()
        .then(post => {
            post.populate('createdBy', '-_id email')
                .execPopulate().then(post => {
                    res.status(200).json({
                    post: post
                });
            });
        });
}