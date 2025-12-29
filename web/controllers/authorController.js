// web/controllers/authorController.js
// Controlador para manejar las vistas relacionadas con autores

const getDbPool = (req) => req.app.locals.db;

/**
 * Muestra el listado de todos los autores
 */
exports.showAllAuthors = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  let authors = [];
  let error = null;

  try {
    const result = await pool.query("SELECT * FROM authors ORDER BY name");
    authors = result.rows;
  } catch (dbError) {
    console.error("Error al obtener autores:", dbError.stack);
    error = "Error al cargar los autores.";
  }

  res.render("authors/list", {
    pageTitle: "Autores",
    authors,
    user,
    error,
  });
};

/**
 * Muestra el detalle de un autor específico
 */
exports.showAuthorDetail = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  const authorId = req.params.id;
  let author = null;
  let books = [];
  let error = null;

  try {
    // Obtener datos del autor
    const authorResult = await pool.query(
      "SELECT * FROM authors WHERE id = $1",
      [authorId]
    );
    author = authorResult.rows[0];

    // Obtener libros del autor
    const booksResult = await pool.query(
      `
            SELECT b.* FROM books b
            INNER JOIN book_author ba ON b.id = ba.book_id
            WHERE ba.author_id = $1
        `,
      [authorId]
    );
    books = booksResult.rows;
  } catch (dbError) {
    console.error("Error al obtener autor:", dbError.stack);
    error = "Error al cargar el autor.";
  }

  res.render("authors/detail", {
    pageTitle: author ? author.name : "Autor",
    author,
    books,
    user,
    error,
  });
};

/**
 * Muestra el formulario para crear/editar autor (Admin)
 */
exports.showAuthorForm = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  const authorId = req.params.id;
  let author = null;
  let error = null;

  if (authorId) {
    try {
      const result = await pool.query("SELECT * FROM authors WHERE id = $1", [
        authorId,
      ]);
      author = result.rows[0];
    } catch (dbError) {
      console.error("Error al obtener autor:", dbError.stack);
      error = "Error al cargar el autor.";
    }
  }

  res.render("admin/author_form", {
    pageTitle: authorId ? "Editar Autor" : "Nuevo Autor",
    author,
    user,
    error,
  });
};

module.exports = exports;
