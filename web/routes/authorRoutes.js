// web/routes/authorRoutes.js
// Rutas para las vistas relacionadas con autores

const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const webController = require("../controllers/webController");

// Rutas públicas
router.get("/", authorController.showAllAuthors);
router.get("/:id", authorController.showAuthorDetail);

// Rutas de administración (requieren login y rol admin)
router.get(
  "/admin/new",
  webController.requireLogin,
  webController.checkRole("administrador"),
  authorController.showAuthorForm
);

router.get(
  "/admin/edit/:id",
  webController.requireLogin,
  webController.checkRole("administrador"),
  authorController.showAuthorForm
);

module.exports = router;
