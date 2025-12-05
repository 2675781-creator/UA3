// controllers/userPageController.js
import bcrypt from "bcrypt";
import User from "../modeles/User.js";

// GET /users
export const listeUsersPage = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render("users/index", {
      title: "Gestion des utilisateurs",
      users,
    });
  } catch (err) {
    console.error("Erreur listeUsersPage :", err);
    res.status(500).send("Erreur serveur");
  }
};

// GET /users/new
export const afficherFormulaireAjoutUser = (req, res) => {
  res.render("users/new", {
    title: "Créer un utilisateur",
    error: null,
  });
};

// POST /users/new
export const creerUserDepuisPage = async (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;
  const erreurs = [];

  if (!nom) erreurs.push("Le nom est obligatoire.");
  if (!email) erreurs.push("L'email est obligatoire.");
  if (!mot_de_passe) erreurs.push("Le mot de passe est obligatoire.");
  if (mot_de_passe && mot_de_passe.length < 6) {
    erreurs.push("Le mot de passe doit contenir au moins 6 caractères.");
  }
  if (!role) erreurs.push("Le rôle est obligatoire.");

  if (erreurs.length > 0) {
    return res.status(400).render("users/new", {
      title: "Créer un utilisateur",
      error: erreurs.join(" "),
    });
  }

  try {
    const existe = await User.findOne({ where: { email } });
    if (existe) {
      return res.status(400).render("users/new", {
        title: "Créer un utilisateur",
        error: "Un compte avec cet email existe déjà.",
      });
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);

    await User.create({
      nom,
      email,
      mot_de_passe: hash,
      role,
    });

    res.redirect("/users");
  } catch (err) {
    console.error("Erreur creerUserDepuisPage :", err);
    res.status(500).render("users/new", {
      title: "Créer un utilisateur",
      error: "Erreur serveur. Réessaie plus tard.",
    });
  }
};

// GET /users/:id/edit
export const afficherFormulaireEditionUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    res.render("users/edit", {
      title: "Modifier un utilisateur",
      user,
      error: null,
    });
  } catch (err) {
    console.error("Erreur afficherFormulaireEditionUser :", err);
    res.status(500).send("Erreur serveur");
  }
};

// POST /users/:id/edit
export const mettreAJourUserDepuisPage = async (req, res) => {
  const { id } = req.params;
  const { nom, email, mot_de_passe, role } = req.body;

  const erreurs = [];
  if (!nom) erreurs.push("Le nom est obligatoire.");
  if (!email) erreurs.push("L'email est obligatoire.");
  if (!role) erreurs.push("Le rôle est obligatoire.");

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    if (erreurs.length > 0) {
      return res.status(400).render("users/edit", {
        title: "Modifier un utilisateur",
        user,
        error: erreurs.join(" "),
      });
    }

    user.nom = nom;
    user.email = email;
    user.role = role;

    // Si un nouveau mot de passe est fourni, on le remplace
    if (mot_de_passe && mot_de_passe.length >= 6) {
      user.mot_de_passe = await bcrypt.hash(mot_de_passe, 10);
    }

    await user.save();

    res.redirect("/users");
  } catch (err) {
    console.error("Erreur mettreAJourUserDepuisPage :", err);
    res.status(500).render("users/edit", {
      title: "Modifier un utilisateur",
      user: { id_user: id, nom, email, role },
      error: "Erreur serveur. Réessaie plus tard.",
    });
  }
};

// POST /users/:id/delete
export const supprimerUserDepuisPage = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    await user.destroy();
    res.redirect("/users");
  } catch (err) {
    console.error("Erreur supprimerUserDepuisPage :", err);
    res.status(500).send("Erreur serveur");
  }
};