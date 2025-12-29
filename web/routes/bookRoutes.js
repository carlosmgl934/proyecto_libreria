// web/routes/bookRoutes.js
// Rutas para las vistas relacionadas con libros

const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const webController = require("../controllers/webController");

// Rutas públicas
router.get("/", bookController.showAllBooks);
router.get("/:id", bookController.showBookDetail);

// Rutas de administración (requieren login y rol admin)
router.get(
  "/admin/new",
  webController.requireLogin,
  webController.checkRole("administrador"),
  bookController.showBookForm
);

router.get(
  "/admin/edit/:id",
  webController.requireLogin,
  webController.checkRole("administrador"),
  bookController.showBookForm
);

module.exports = router;
