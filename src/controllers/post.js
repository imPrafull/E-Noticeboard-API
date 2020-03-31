const Post = require('../models/post');

exports.getPosts = (req, res) => {
    const posts = Post.find()
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