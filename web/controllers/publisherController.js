// web/controllers/publisherController.js
// Controlador para manejar las vistas relacionadas con editoriales

const getDbPool = (req) => req.app.locals.db;

/**
 * Muestra el listado de todas las editoriales
 */
exports.showAllPublishers = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  let publishers = [];
  let error = null;

  try {
    const result = await pool.query("SELECT * FROM publishers ORDER BY name");
    publishers = result.rows;
  } catch (dbError) {
    console.error("Error al obtener editoriales:", dbError.stack);
    error = "Error al cargar las editoriales.";
  }

  res.render("publishers/list", {
    pageTitle: "Editoriales",
    publishers,
    user,
    error,
  });
};

/**
 * Muestra el detalle de una editorial específica
 */
exports.showPublisherDetail = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  const publisherId = req.params.id;
  let publisher = null;
  let books = [];
  let error = null;

  try {
    // Obtener datos de la editorial
    const publisherResult = await pool.query(
      "SELECT * FROM publishers WHERE id = $1",
      [publisherId]
    );
    publisher = publisherResult.rows[0];

    // Obtener libros de la editorial
    const booksResult = await pool.query(
      `
            SELECT b.* 
            FROM books b
            WHERE b.publisher_id = $1
            ORDER BY b.title
        `,
      [publisherId]
    );
    books = booksResult.rows;
  } catch (dbError) {
    console.error("Error al obtener editorial:", dbError.stack);
    error = "Error al cargar la editorial.";
  }

  res.render("publishers/detail", {
    pageTitle: publisher ? publisher.name : "Editorial",
    publisher,
    books,
    user,
    error,
  });
};

/**
 * Muestra el formulario para crear/editar editorial (Admin)
 */
exports.showPublisherForm = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  const publisherId = req.params.id;
  let publisher = null;
  let error = null;

  if (publisherId) {
    try {
      const result = await pool.query(
        "SELECT * FROM publishers WHERE id = $1",
        [publisherId]
      );
      publisher = result.rows[0];
    } catch (dbError) {
      console.error("Error al obtener editorial:", dbError.stack);
      error = "Error al cargar la editorial.";
    }
  }

  res.render("admin/publisher_form", {
    pageTitle: publisherId ? "Editar Editorial" : "Nueva Editorial",
    publisher,
    user,
    error,
  });
};

module.exports = exports;
