import express, { json } from 'express'
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
import 'dotenv/config.js'

export const createApp = ({ movieModel }) => {
  // EN EL FUTURO: el import del json será así:
  // import movies from './movies.json' with { type: 'json' }

  // Como leer un json en ESModules
  // import fs from 'node:fs'
  // const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

  const app = express()
  app.use(json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  // Todos los recursos que sean MOVIES se identifica con /movies
  app.use('/movies', createMovieRouter({ movieModel }))

  const PORT = process.env.PORT ?? 3000

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}
