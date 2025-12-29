// web/controllers/authController.js
// Controlador para manejar las vistas relacionadas con autenticación

const getDbPool = (req) => req.app.locals.db;

/**
 * Muestra el formulario de login
 */
exports.showLoginForm = (req, res) => {
  const user = req.session.user;

  // Si ya está logueado, redirigir a home
  if (user) {
    return res.redirect("/");
  }

  res.render("auth/login", {
    pageTitle: "Iniciar Sesión",
    user: null,
    error: null,
  });
};

/**
 * Muestra el formulario de registro
 */
exports.showRegisterForm = (req, res) => {
  const user = req.session.user;

  // Si ya está logueado, redirigir a home
  if (user) {
    return res.redirect("/");
  }

  res.render("auth/register", {
    pageTitle: "Registrarse",
    user: null,
    error: null,
  });
};

/**
 * Muestra el perfil del usuario
 */
exports.showUserProfile = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  let userDetails = null;
  let error = null;

  if (!user) {
    return res.redirect("/login");
  }

  try {
    const result = await pool.query(
      `
            SELECT u.*, 
                   COUNT(DISTINCT o.id) as total_orders,
                   COUNT(DISTINCT r.id) as total_reviews
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            LEFT JOIN reviews r ON u.id = r.user_id
            WHERE u.id = $1
            GROUP BY u.id
        `,
      [user.id]
    );
    userDetails = result.rows[0];
  } catch (dbError) {
    console.error("Error al obtener perfil:", dbError.stack);
    error = "Error al cargar el perfil.";
  }

  res.render("auth/profile", {
    pageTitle: "Mi Perfil",
    user,
    userDetails,
    error,
  });
};

/**
 * Muestra el formulario para editar perfil
 */
exports.showEditProfileForm = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  let userDetails = null;
  let error = null;

  if (!user) {
    return res.redirect("/login");
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      user.id,
    ]);
    userDetails = result.rows[0];
  } catch (dbError) {
    console.error("Error al obtener usuario:", dbError.stack);
    error = "Error al cargar los datos.";
  }

  res.render("auth/edit_profile", {
    pageTitle: "Editar Perfil",
    user,
    userDetails,
    error,
  });
};

/**
 * Cierra la sesión del usuario
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
    }
    res.redirect("/");
  });
};

module.exports = exports;
