// web/routes/authRoutes.js
// Rutas para las vistas relacionadas con autenticación

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const webController = require("../controllers/webController");

// Rutas públicas
router.get("/login", authController.showLoginForm);
router.get("/register", authController.showRegisterForm);
router.get("/logout", authController.logout);

// Rutas protegidas (requieren login)
router.get(
  "/profile",
  webController.requireLogin,
  authController.showUserProfile
);

router.get(
  "/profile/edit",
  webController.requireLogin,
  authController.showEditProfileForm
);

module.exports = router;
