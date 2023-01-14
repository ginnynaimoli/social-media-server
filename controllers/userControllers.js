import User from "../models/User.js";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    res.status(200).json(user)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const getUserFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    )

    const formattedFriendList = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }
      }
    )
    res.status(200).json(formattedFriendList)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const addRemoveFriend = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
    const friend = await User.findById(req.params.friendId)

    if (user.friends.includes(req.params.friendId)) {
      user.friends = user.friends.filter((id) => id !== req.params.friendId)

      friend.friends = friend.friends.filter((id) => id !== req.params.userId)
    } else {
      user.friends.push(req.params.friendId)
      friend.friends.push(req.params.userId)
    }

    await user.save()
    await friend.save()

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    )

    const formattedFriendList = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }
      }
    )
    res.status(200).json(formattedFriendList)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}