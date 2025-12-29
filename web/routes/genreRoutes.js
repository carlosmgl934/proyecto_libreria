// web/routes/genreRoutes.js
// Rutas para las vistas relacionadas con géneros

const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genreController");
const webController = require("../controllers/webController");

// Rutas públicas
router.get("/", genreController.showAllGenres);
router.get("/:id", genreController.showGenreBooks);

// Rutas de administración (requieren login y rol admin)
router.get(
  "/admin/new",
  webController.requireLogin,
  webController.checkRole("administrador"),
  genreController.showGenreForm
);

router.get(
  "/admin/edit/:id",
  webController.requireLogin,
  webController.checkRole("administrador"),
  genreController.showGenreForm
);

module.exports = router;
