import express from "express"
import helmet from "helmet"
import cors from "cors"
import { config } from "./config"
import { generalLimiter } from "./middleware/rate-limit.middleware"
import compression from "compression"
import { requestLogger } from "./middleware/logging.middleware"
import { errorHandler, notFound } from "./middleware/error.middleware"
import { App } from "./constants/app"
import apiRouter from "./routes/index.routes"
import morgan from "morgan"
import http from "http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)
export const io = new Server(server, {
    cors: {
        origin: config.NODE_ENV === "production" ? config.CLIENT_URL : "*",
        methods: ["GET", "POST"],
    },
})

// Helmet untuk mengatur berbagai header HTTP guna melindungi aplikasi dari kerentanan web yang umum.
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false
}))

app.use(cors({
    origin: config.NODE_ENV === "production" ? config.CLIENT_URL : "*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: config.NODE_ENV === "production"
        ? ['Content-Type', 'Authorization', 'X-Requested-With']
        : ['Content-Type', 'Authorization', 'X-Requested-With', 'ngrok-skip-browser-warning'],
}))

//Rate limiting untuk melindungi dari serangan brute-force dan penyalahgunaan
app.use(generalLimiter)

// Middleware pengurai body - Mengurai payload JSON dan URL-encoded
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Middleware kompresi - Mengompres body respons untuk pemuatan yang lebih cepat
app.use(compression());
app.use(requestLogger)

// Middleware logging permintaan (Morgan)
if (config.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

io.on("connection", (socket) => {
    console.log("a user connected")

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
})

app.get("/", (req, res) => {
    res.status(200).json({
        message: "success"
    })
})

app.use(App.API_PREFIX, apiRouter)

app.use(notFound)
app.use(errorHandler)

export default server