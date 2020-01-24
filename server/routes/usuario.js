const express = require("express");
const router = express.Router();
const usuario = require("../controllers/usuario.controller");
const {
  verificaToken,
  verificaAdmin_rol,
  verificaDatosUsuario
} = require("../middlewares/autenticacion");
const {
  schemaUsuario
} = require("../middlewares/usuarioSchema");
const {
  setHeaders
} = require("../middlewares/setHeaders");

router.post(
  "/user",
  [verificaToken, verificaAdmin_rol, verificaDatosUsuario, schemaUsuario],
  usuario.createUser
);
router.get("/users", [verificaToken, verificaAdmin_rol], usuario.getUsers);
router.get(
  "/users/deleted",
  [verificaToken, verificaAdmin_rol],
  usuario.getDeletedUsers
);
router.get(
  "/user/rut/:rut",
  [verificaToken, verificaAdmin_rol],
  usuario.getUserByRut
);
router.get(
  "/user/name/:nombre&:apPat&:apMat",
  [verificaToken, verificaAdmin_rol],
  usuario.getUserByName
);
router.put("/user/:id", [verificaToken, verificaAdmin_rol, setHeaders], usuario.updateUser);

router.delete(
  "/user/:rut",
  [verificaToken, verificaAdmin_rol],
  usuario.deleteUser
);
module.exports = router;