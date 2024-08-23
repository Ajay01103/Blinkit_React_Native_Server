import "dotenv/config"
import Fastify from "fastify"
import { connectDB } from "./src/config/connect.js"
import { PORT } from "./src/config/config.js"
import { admin, buildAdminRouter } from "./src/config/setup.js"
import { registerRoutes } from "./src/routes/index.js"
import fastifySocketIO from "fastify-socket.io"

const start = async () => {
  const fastify = Fastify({
    logger: true,
  })

  fastify.register(fastifySocketIO, {
    cors: {
      origin: "*",
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ["websocket"],
  })

  await registerRoutes(fastify)

  await connectDB(process.env.DATABASE_URL)
  await buildAdminRouter(fastify)

  fastify.listen({ port: PORT }, (err, addr) => {
    if (err) {
      console.log(err)
    } else {
      console.log(`Blinkit started on http://localhost:${PORT}${admin.options.rootPath}`)
    }
  })

  fastify.ready().then(() => {
    fastify.io.on("connection", (socket) => {
      console.log("A user Connected")

      socket.on("joinRoom", (orderId) => {
        socket.join(orderId)
        console.log(`User joined room ${orderId}`)
      })

      socket.on("disconnect", () => {
        console.log("user disconnected")
      })
    })
  })
}

start()
