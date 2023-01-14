import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization")
    if (!token) {
      return res.status(403).send("You are not authorized")
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft()
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = verified
    next()
  } catch { 
    res.status(500).json({ error: err.message })
  }
}
