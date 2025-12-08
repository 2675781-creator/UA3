// index.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import database from "./config/connection.js";
import methodOverride from "method-override";
import session from 'express-session';
//import {renderFile} from "ejs";
import ejs from "ejs";
import path from 'path';
import { fileURLToPath } from 'url';


import auteurRoute from "./routes/auteurRoute.js";
import categorieRoute from "./routes/categorieRoute.js";
import clientRoute from "./routes/clientRoute.js";
import employeRoute from "./routes/employeRoute.js";
import empruntRoute from "./routes/empruntRoute.js";
import articleRoute from "./routes/articleRoute.js";
import authRoute from "./routes/authRoute.js";
import authMiddleware from "./middlewares/authMiddleware.js";


// IMPORTANT : importe les modèles + relations AVANT le sync
import "./modeles/relations.js";

// Chargement des variables d'environnement
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//app.engine('ejs', renderFile)
app.engine('ejs', ejs.renderFile)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'));


// Middlewares globaux
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")))
app.use(methodOverride('_method'))


//Cacher le token dans le navigateur
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } //mettre a true si https
}))

// Middleware global pour rendre l'utilisateur disponible dans toutes les vues EJS
app.use((req, res, next) => {
    // Récupère l'utilisateur stocké dans la session, s'il existe
    res.locals.user = req.session.user || null; 
    next();
});


const PORT = process.env.PORT || 8000;
console.log("Variables d'environnement :", {
  PORT: process.env.PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
});

// Route de test
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API UA2 !");
});



// Routes API
app.use("/api/articles", articleRoute);
app.use("/api/categories", categorieRoute);
app.use("/api/clients", clientRoute);
app.use("/api/employes", employeRoute);
app.use("/api/auteurs", auteurRoute);
app.use("/api/emprunts", authMiddleware, empruntRoute);
app.use("/api/auth", authRoute);

//  Démarrage du serveur + création des tables Sequelize 
const startServer = async () => {
  try {
    // Test de connexion à la base
    await database.authenticate();
    console.log("Connexion à la base de données réussie ");

    // Synchronisation des tables 
    //database.sync({ alter: true })
    //console.log("Tables synchronisées avec la base ");

    // Lancement du serveur HTTP
    app.listen(PORT, () => {
      console.log(`Le serveur est démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("Erreur lors du démarrage de l'application");
    console.error(error);
  }
};

startServer();
