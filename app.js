// app.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";

import "./modeles/relations.js";

import authRoute from "./routes/authRoute.js";
import userPageRoute from "./routes/userPageRoute.js";

// Routes API
import articleRoute from "./routes/articleRoute.js";

// Routes PAGES (EJS)
import articlePageRoute from "./routes/articlePageRoute.js";
import auteurPageRoute from "./routes/auteurPageRoute.js";

dotenv.config();

const app = express();

// Pour pouvoir utiliser __dirname avec ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----- Configuration du moteur de vues EJS -----
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ----- Middlewares globaux -----
// Pour parser le JSON (API)
app.use(express.json());

// Pour parser les formulaires (POST)
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques (CSS, images, JS côté client)
app.use(express.static(path.join(__dirname, "public")));

// ----- Session (pour EJS) -----
// ⚠️ La session doit être initialisée AVANT les routes qui utilisent req.session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "un-secret-assez-long-et-unique",
    resave: false,
    saveUninitialized: false,
  })
);

// Rendre l'utilisateur disponible dans toutes les vues EJS = variable "user"
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ----- ROUTES API (JSON, protégées par JWT dans les fichiers de routes avec authMiddleware) -----
app.use("/api/articles", articleRoute);
// ex: app.use("/api/auteurs", auteurRoute);

// ----- ROUTES PAGES EJS -----
// Routes d'authentification (login / register / logout)
app.use("/auth", authRoute);

// Routes gestion utilisateurs (EJS, admin only dans userPageRoute)
app.use("/users", userPageRoute);

// Page d'accueil simple
app.get("/", (req, res) => {
  res.render("index", {
    titre: "Page d'accueil",
    message: "EJS fonctionne !",
  });
});

// Pages articles (EJS)
app.use("/articles", articlePageRoute);

// Pages auteurs (EJS)
app.use("/auteurs", auteurPageRoute);

// ----- Gestion des erreurs 404 (toujours en dernier) -----
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page non trouvée",
  });
});

// ----- Démarrage du serveur -----
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});