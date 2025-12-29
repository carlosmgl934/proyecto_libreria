// web/controllers/genreController.js
// Controlador para manejar las vistas relacionadas con géneros literarios

const getDbPool = (req) => req.app.locals.db;

/**
 * Muestra el listado de todos los géneros
 */
exports.showAllGenres = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  let genres = [];
  let error = null;

  try {
    const result = await pool.query("SELECT * FROM genres ORDER BY name");
    genres = result.rows;
  } catch (dbError) {
    console.error("Error al obtener géneros:", dbError.stack);
    error = "Error al cargar los géneros.";
  }

  res.render("genres/list", {
    pageTitle: "Géneros Literarios",
    genres,
    user,
    error,
  });
};

/**
 * Muestra los libros de un género específico
 */
exports.showGenreBooks = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  const genreId = req.params.id;
  let genre = null;
  let books = [];
  let error = null;

  try {
    // Obtener datos del género
    const genreResult = await pool.query("SELECT * FROM genres WHERE id = $1", [
      genreId,
    ]);
    genre = genreResult.rows[0];

    // Obtener libros del género
    const booksResult = await pool.query(
      `
            SELECT b.*, p.name as publisher_name 
            FROM books b
            LEFT JOIN publishers p ON b.publisher_id = p.id
            INNER JOIN book_genre bg ON b.id = bg.book_id
            WHERE bg.genre_id = $1
            ORDER BY b.title
        `,
      [genreId]
    );
    books = booksResult.rows;
  } catch (dbError) {
    console.error("Error al obtener género:", dbError.stack);
    error = "Error al cargar el género.";
  }

  res.render("genres/detail", {
    pageTitle: genre ? genre.name : "Género",
    genre,
    books,
    user,
    error,
  });
};

/**
 * Muestra el formulario para crear/editar género (Admin)
 */
exports.showGenreForm = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  const genreId = req.params.id;
  let genre = null;
  let error = null;

  if (genreId) {
    try {
      const result = await pool.query("SELECT * FROM genres WHERE id = $1", [
        genreId,
      ]);
      genre = result.rows[0];
    } catch (dbError) {
      console.error("Error al obtener género:", dbError.stack);
      error = "Error al cargar el género.";
    }
  }

  res.render("admin/genre_form", {
    pageTitle: genreId ? "Editar Género" : "Nuevo Género",
    genre,
    user,
    error,
  });
};

module.exports = exports;
