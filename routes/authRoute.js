// routes/authRoute.js
import { Router } from "express";
import { register, login, getAllUsers  } from "../controllers/authController.js";

const authRoute = Router();

// Optionnel : inscription
authRoute.post("/register", register);

// Obligatoire : login
authRoute.post("/login", login);

// Liste de tous les utilisateurs
authRoute.get("/users", getAllUsers);

export default authRoute;