import "dotenv/config"
import Fastify from "fastify"
import { connectDB } from "./src/config/connect.js"
import { PORT } from "./src/config/config.js"
import { admin, buildAdminRouter } from "./src/config/setup.js"

const start = async () => {
  const fastify = Fastify({
    logger: true,
  })

  await connectDB(process.env.DATABASE_URL)
  await buildAdminRouter(fastify)

  fastify.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
    if (err) {
      console.log(err)
    } else {
      console.log(`Blinkit started on http://localhost:${PORT}${admin.options.rootPath}`)
    }
  })
}

start()
