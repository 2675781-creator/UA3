// routes/userPageRoute.js
import express from "express";
import { requireAuth, requireRole } from "../middlewares/requireAuth.js";
import {
  listeUsersPage,
  afficherFormulaireAjoutUser,
  creerUserDepuisPage,
  afficherFormulaireEditionUser,
  mettreAJourUserDepuisPage,
  supprimerUserDepuisPage,
} from "../controllers/userPageController.js";

const router = express.Router();

// Toutes ces routes sont réservées aux admins
router.get("/", requireAuth, requireRole("admin"), listeUsersPage);

router.get("/new", requireAuth, requireRole("admin"), afficherFormulaireAjoutUser);
router.post("/new", requireAuth, requireRole("admin"), creerUserDepuisPage);

router.get("/:id/edit", requireAuth, requireRole("admin"), afficherFormulaireEditionUser);
router.post("/:id/edit", requireAuth, requireRole("admin"), mettreAJourUserDepuisPage);

router.post("/:id/delete", requireAuth, requireRole("admin"), supprimerUserDepuisPage);

export default router;