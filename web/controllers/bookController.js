// web/controllers/bookController.js
// Controlador para manejar las vistas relacionadas con libros

const getDbPool = (req) => req.app.locals.db;

/**
 * Muestra el listado de todos los libros
 */
exports.showAllBooks = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  let books = [];
  let error = null;

  try {
    const result = await pool.query(`
            SELECT b.*, p.name as publisher_name 
            FROM books b
            LEFT JOIN publishers p ON b.publisher_id = p.id
            ORDER BY b.title
        `);
    books = result.rows;
  } catch (dbError) {
    console.error("Error al obtener libros:", dbError.stack);
    error = "Error al cargar los libros.";
  }

  res.render("books/list", {
    pageTitle: "Catálogo de Libros",
    books,
    user,
    error,
  });
};

/**
 * Muestra el detalle de un libro específico
 */
exports.showBookDetail = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  const bookId = req.params.id;
  let book = null;
  let authors = [];
  let genres = [];
  let reviews = [];
  let error = null;

  try {
    // Obtener datos del libro
    const bookResult = await pool.query(
      `
            SELECT b.*, p.name as publisher_name 
            FROM books b
            LEFT JOIN publishers p ON b.publisher_id = p.id
            WHERE b.id = $1
        `,
      [bookId]
    );
    book = bookResult.rows[0];

    // Obtener autores del libro
    const authorsResult = await pool.query(
      `
            SELECT a.* FROM authors a
            INNER JOIN book_author ba ON a.id = ba.author_id
            WHERE ba.book_id = $1
        `,
      [bookId]
    );
    authors = authorsResult.rows;

    // Obtener géneros del libro
    const genresResult = await pool.query(
      `
            SELECT g.* FROM genres g
            INNER JOIN book_genre bg ON g.id = bg.genre_id
            WHERE bg.book_id = $1
        `,
      [bookId]
    );
    genres = genresResult.rows;

    // Obtener reseñas del libro
    const reviewsResult = await pool.query(
      `
            SELECT r.*, u.name as user_name 
            FROM reviews r
            INNER JOIN users u ON r.user_id = u.id
            WHERE r.book_id = $1
            ORDER BY r.created_at DESC
        `,
      [bookId]
    );
    reviews = reviewsResult.rows;
  } catch (dbError) {
    console.error("Error al obtener libro:", dbError.stack);
    error = "Error al cargar el libro.";
  }

  res.render("books/detail", {
    pageTitle: book ? book.title : "Libro",
    book,
    authors,
    genres,
    reviews,
    user,
    error,
  });
};

/**
 * Muestra el formulario para crear/editar libro (Admin)
 */
exports.showBookForm = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  const bookId = req.params.id;
  let book = null;
  let publishers = [];
  let allAuthors = [];
  let allGenres = [];
  let error = null;

  try {
    // Obtener todas las editoriales
    const publishersResult = await pool.query(
      "SELECT * FROM publishers ORDER BY name"
    );
    publishers = publishersResult.rows;

    // Obtener todos los autores
    const authorsResult = await pool.query(
      "SELECT * FROM authors ORDER BY name"
    );
    allAuthors = authorsResult.rows;

    // Obtener todos los géneros
    const genresResult = await pool.query("SELECT * FROM genres ORDER BY name");
    allGenres = genresResult.rows;

    if (bookId) {
      const result = await pool.query("SELECT * FROM books WHERE id = $1", [
        bookId,
      ]);
      book = result.rows[0];
    }
  } catch (dbError) {
    console.error("Error al cargar datos:", dbError.stack);
    error = "Error al cargar los datos.";
  }

  res.render("admin/libro_form", {
    pageTitle: bookId ? "Editar Libro" : "Nuevo Libro",
    book,
    publishers,
    allAuthors,
    allGenres,
    user,
    error,
  });
};

module.exports = exports;
