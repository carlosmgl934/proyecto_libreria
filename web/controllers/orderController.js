// web/controllers/orderController.js
// Controlador para manejar las vistas relacionadas con pedidos/compras

const getDbPool = (req) => req.app.locals.db;

/**
 * Muestra el historial de pedidos del usuario
 */
exports.showUserOrders = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  let orders = [];
  let error = null;

  if (!user) {
    return res.redirect("/login");
  }

  try {
    const result = await pool.query(
      `
            SELECT o.*, 
                   COUNT(oi.id) as total_items,
                   SUM(oi.quantity * oi.price) as total_amount
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `,
      [user.id]
    );
    orders = result.rows;
  } catch (dbError) {
    console.error("Error al obtener pedidos:", dbError.stack);
    error = "Error al cargar los pedidos.";
  }

  res.render("orders/list", {
    pageTitle: "Mis Pedidos",
    orders,
    user,
    error,
  });
};

/**
 * Muestra el detalle de un pedido específico
 */
exports.showOrderDetail = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  const orderId = req.params.id;
  let order = null;
  let orderItems = [];
  let error = null;

  if (!user) {
    return res.redirect("/login");
  }

  try {
    // Obtener datos del pedido
    const orderResult = await pool.query(
      `
            SELECT o.*
            FROM orders o
            WHERE o.id = $1 AND o.user_id = $2
        `,
      [orderId, user.id]
    );
    order = orderResult.rows[0];

    if (order) {
      // Obtener items del pedido
      const itemsResult = await pool.query(
        `
                SELECT oi.*, b.title, b.cover_url
                FROM order_items oi
                INNER JOIN books b ON oi.book_id = b.id
                WHERE oi.order_id = $1
            `,
        [orderId]
      );
      orderItems = itemsResult.rows;
    }
  } catch (dbError) {
    console.error("Error al obtener pedido:", dbError.stack);
    error = "Error al cargar el pedido.";
  }

  res.render("orders/detail", {
    pageTitle: "Detalle del Pedido",
    order,
    orderItems,
    user,
    error,
  });
};

/**
 * Muestra todos los pedidos (Admin)
 */
exports.showAllOrders = async (req, res) => {
  const pool = getDbPool(req);
  const user = req.session.user;
  let orders = [];
  let error = null;

  try {
    const result = await pool.query(`
            SELECT o.*, 
                   u.name as user_name,
                   u.email as user_email,
                   COUNT(oi.id) as total_items,
                   SUM(oi.quantity * oi.price) as total_amount
            FROM orders o
            INNER JOIN users u ON o.user_id = u.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id, u.name, u.email
            ORDER BY o.created_at DESC
        `);
    orders = result.rows;
  } catch (dbError) {
    console.error("Error al obtener pedidos:", dbError.stack);
    error = "Error al cargar los pedidos.";
  }

  res.render("admin/orders_list", {
    pageTitle: "Gestión de Pedidos",
    orders,
    user,
    error,
  });
};

/**
 * Muestra el carrito de compra
 */
exports.showCart = (req, res) => {
  const user = req.session.user;
  const cart = req.session.cart || [];

  res.render("orders/cart", {
    pageTitle: "Carrito de Compra",
    cart,
    user,
    error: null,
  });
};

module.exports = exports;
