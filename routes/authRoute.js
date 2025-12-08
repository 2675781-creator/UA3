import { Router } from "express";
import {
  loginPage,
  renderLoginPage,
  renderRegisterPage,
  registerPage,
  logout
} from "../controllers/authController.js";
//import { renderLoginPage } from "../controllers/authController.js";

const authRoute = Router();

// PAGES EJS
authRoute.get("/login-page", renderLoginPage);
authRoute.post("/login-page", loginPage);

authRoute.get("/register-page", renderRegisterPage);
authRoute.post("/register-page", registerPage);

authRoute.get("/logout", logout);

export default authRoute;