import { Router } from "express";
import {
  loginPage,
  loginFormHandler,
  registerPage,
  registerFormHandler,
  logout,
} from "../controllers/authPageController.js";

const authRoute = Router();

// PAGES EJS
authRoute.get("/login-page", loginPage);
authRoute.post("/login-page", loginFormHandler);

authRoute.get("/register-page", registerPage);
authRoute.post("/register-page", registerFormHandler);

authRoute.get("/logout", logout);

export default authRoute;