// web/routes/orderRoutes.js
// Rutas para las vistas relacionadas con pedidos/compras

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const webController = require("../controllers/webController");

// Rutas protegidas (requieren login)
router.get(
  "/my-orders",
  webController.requireLogin,
  orderController.showUserOrders
);

router.get(
  "/my-orders/:id",
  webController.requireLogin,
  orderController.showOrderDetail
);

router.get("/cart", orderController.showCart);

// Rutas de administración (requieren login y rol admin)
router.get(
  "/admin/all",
  webController.requireLogin,
  webController.checkRole("administrador"),
  orderController.showAllOrders
);

module.exports = router;
