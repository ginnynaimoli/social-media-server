import Post from '../models/Post.js'
import User from '../models/User.js'

export const createPost = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId)
    const newPost = new Post({
      userId: req.body.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description: req.body.description,
      userPicturePath: user.picturePath,
      picturePath: req.body.picturePath,
      likes: {},
      comments: []
    })
    await newPost.save()

    const post = await Post.find()
    res.status(201).json(post)
  } catch (err) {
    res.status(409).json({ message: err.message })
  }
}

export const getAllPosts = async (req, res) => {
  try {
    const post = await Post.find()
    res.status(200).json(post)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const getUserPosts = async (req, res) => {
  try {    
    const { userId } = req.params
    const post = await Post.find({ userId })
    res.status(200).json(post)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const likePost = async (req, res) => {
  try {    
   const post = await Post.findById(req.params.postId)

   const isLiked = post.likes.get(req.body.userId)
   if (isLiked) {
    post.likes.delete(req.body.userId)
   } else {
    post.likes.set(req.body.userId, true)
   }

   const updatedPost = await Post.findByIdAndUpdate( 
    req.params.postId, 
    { likes: post.likes },
    { new: true } 
  )

  res.status(200).json(updatedPost)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

