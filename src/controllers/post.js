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
        .then(result => {
            res.status(200).json({
                post: result
            });
        });
}