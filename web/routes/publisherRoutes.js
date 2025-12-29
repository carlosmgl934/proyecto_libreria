// web/routes/publisherRoutes.js
// Rutas para las vistas relacionadas con editoriales

const express = require("express");
const router = express.Router();
const publisherController = require("../controllers/publisherController");
const webController = require("../controllers/webController");

// Rutas públicas
router.get("/", publisherController.showAllPublishers);
router.get("/:id", publisherController.showPublisherDetail);

// Rutas de administración (requieren login y rol admin)
router.get(
  "/admin/new",
  webController.requireLogin,
  webController.checkRole("administrador"),
  publisherController.showPublisherForm
);

router.get(
  "/admin/edit/:id",
  webController.requireLogin,
  webController.checkRole("administrador"),
  publisherController.showPublisherForm
);

module.exports = router;
