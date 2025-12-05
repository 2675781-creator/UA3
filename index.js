// index.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import database from "./config/connection.js";

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

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    await database.sync({ alter: true });
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
