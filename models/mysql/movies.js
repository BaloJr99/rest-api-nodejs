import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Pirata99*',
  database: 'moviesdb'
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await connection.query(`
        SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate
          FROM movies AS m WHERE m.id IN (
          SELECT movie_id FROM movie_genres AS mg WHERE mg.genre_id IN (
            SELECT id FROM genres AS g WHERE g.name = ?))`, [lowerCaseGenre])
      if (genres.length === 0) return null

      genres.map((genre) => {
        return genre
      })

      return genres
    }

    const [movies] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movies')
    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movies WHERE id = UUID_TO_BIN(?)', [id])
    if (movies.length === 0) return null

    return movies[0]
  }

  static async create ({ input }) {
    const {
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
      `INSERT INTO movies(id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN('${uuid}'), ?, ?, ?, ?, ?, ?)`,
      [title, year, director, duration, poster, rate])
    } catch (error) {
      throw new Error('Error creating movie')
    }

    const [movies] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movies WHERE id = UUID_TO_BIN(?)', [uuid])

    return movies
  }

  static async delete ({ id }) {
    try {
      await connection.query(
        'DELETE FROM movies WHERE id = UUID_TO_BIN(?)', [id]
      )
    } catch (error) {
      throw new Error('Error deleting the movie')
    }
  }

  static async update ({ id, input }) {

  }
}
