import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { register } from './controllers/authControllers.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import { createPost } from './controllers/postControllers.js'
import { verifyToken } from './middlewares/verifyToken.js'

const PORT = 4000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(cors({origin: true, credentials: true}))
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/assets", express.static(path.join(__dirname, 'public/assets')))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer ({ storage })

app.post('/auth/register', upload.single('picture'), register)
app.post('/posts', verifyToken, upload.single('picture'), createPost)

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)

mongoose.set("strictQuery", true)
mongoose
.connect(process.env.MONGO_URL)
.then(() => console.log('Database Connection successful'))
.catch((err) => console.log(err))

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`)
})

