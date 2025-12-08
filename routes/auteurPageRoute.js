// routes/auteurPageRoute.js
import express from "express";
import { requireAuth, requireRole } from "../middlewares/requireAuth.js";
import {
  listeAuteursPage,
  afficherFormulaireAjoutAuteur,
  creerAuteurDepuisPage,
  afficherProfilAuteur,
  afficherFormulaireEditionAuteur,
  mettreAJourAuteurDepuisPage,
  supprimerAuteurDepuisPage,
} from "../controllers/auteurPageController.js";

const router = express.Router();

// Liste des auteurs : accessible à tout utilisateur connecté
router.get("/", requireAuth, listeAuteursPage);

// Formulaire d'ajout d'un auteur : réservé aux admins
router.get("/new", requireAuth, requireRole("admin"), afficherFormulaireAjoutAuteur);
router.post("/add-auteur", requireAuth, requireRole("admin"), creerAuteurDepuisPage);

// Profil auteur : accessible à tout utilisateur connecté
router.get("/:id", requireAuth, afficherProfilAuteur);

// Edition / suppression : réservé aux admins
router.get("/:id/edit", requireAuth, requireRole("admin"), afficherFormulaireEditionAuteur);
router.post("/:id/edit", requireAuth, requireRole("admin"), mettreAJourAuteurDepuisPage);
router.post("/:id/delete", requireAuth, requireRole("admin"), supprimerAuteurDepuisPage);

export default router;