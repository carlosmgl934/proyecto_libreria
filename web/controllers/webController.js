// servidor/web/controllers/webController.js (EXPANDIDO)

const getDbPool = (req) => req.app.locals.db;

// --- MIDDLEWARES DE SEGURIDAD (Se mantienen) ---

/**
 * Middleware para asegurar que el usuario ha iniciado sesión.
 */
exports.requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.session.redirectTo = req.originalUrl;
    return res.redirect("/auth/login");
  }
  next();
};

/**
 * Middleware para verificar el rol del usuario.
 */
exports.checkRole = (requiredRole) => (req, res, next) => {
  if (!req.session.user || req.session.user.rol !== requiredRole) {
    // Renderiza la vista error.ejs si el acceso es denegado
    return res.status(403).render("error", {
      pageTitle: "Acceso Denegado",
      user: req.session.user,
      message: `Acceso denegado. Rol requerido: ${requiredRole}.`,
    });
  }
  next();
};

// --- VISTAS PÚBLICAS (GETs) ---

/**
 * 1. Home / Inventario Principal.
 */
exports.showAllLibros = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  let libros = [];
  let error = null;

  try {
    const result = await pool.query("SELECT * FROM books ORDER BY title");
    libros = result.rows;
  } catch (dbError) {
    console.error("Error al obtener libros:", dbError.stack);
    error = "Error al cargar la base de datos de libros.";
  }

  res.render("index", {
    pageTitle: "Inventario de Tienda",
    libros,
    user,
    error,
  });
};

/**
 * 7. Panel de Administración.
 */
exports.showAdminPanel = (req, res) => {
  res.render("admin/dashboard", {
    pageTitle: "Panel de Administración",
    user: req.session.user,
  });
};

/**
 * 8. Formulario CRUD de Libros. (Nueva)
 */
exports.showLibroForm = (req, res) => {
  // Se usará para crear o editar (si tiene req.params.id)
  res.render("admin/libro_form", {
    pageTitle: "CRUD Libros",
    user: req.session.user,
    libro: null, // Datos del libro a editar, o null si es nuevo
    error: null,
  });
};
