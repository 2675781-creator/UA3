// controllers/authPageController.js
import bcrypt from "bcrypt";
import User from "../modeles/User.js";

// GET /auth/login-page
export const loginPage = (req, res) => {
  res.render("auth/login", {
    title: "Connexion",
    error: null,
  });
};

// GET /auth/register-page
export const registerPage = (req, res) => {
  res.render("auth/register", {
    title: "Inscription",
    error: null,
  });
};

// POST /auth/login-page
export const loginFormHandler = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).render("auth/login", {
        title: "Connexion",
        error: "Email ou mot de passe incorrect.",
      });
    }

    const ok = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!ok) {
      return res.status(401).render("auth/login", {
        title: "Connexion",
        error: "Email ou mot de passe incorrect.",
      });
    }

    // Stockage dans la session
    req.session.user = {
      id_user: user.id_user,
      nom: user.nom,
      email: user.email,
      role: user.role,
    };

    res.redirect("/auteurs"); // ou une autre page d'accueil
  } catch (err) {
    console.error("Erreur loginFormHandler :", err);
    res.status(500).render("auth/login", {
      title: "Connexion",
      error: "Erreur serveur. Réessaie plus tard.",
    });
  }
};

// POST /auth/register-page
export const registerFormHandler = async (req, res) => {
  const { nom, email, mot_de_passe, confirmation } = req.body;

  const erreurs = [];

  if (!nom) erreurs.push("Le nom est obligatoire.");
  if (!email) erreurs.push("L'email est obligatoire.");
  if (!mot_de_passe) erreurs.push("Le mot de passe est obligatoire.");
  if (mot_de_passe && mot_de_passe.length < 6) {
    erreurs.push("Le mot de passe doit contenir au moins 6 caractères.");
  }
  if (mot_de_passe !== confirmation) {
    erreurs.push("La confirmation du mot de passe ne correspond pas.");
  }

  if (erreurs.length > 0) {
    return res.status(400).render("auth/register", {
      title: "Inscription",
      error: erreurs.join(" "),
    });
  }

  try {
    const existe = await User.findOne({ where: { email } });
    if (existe) {
      return res.status(400).render("auth/register", {
        title: "Inscription",
        error: "Un compte avec cet email existe déjà.",
      });
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);

    await User.create({
      nom,
      email,
      mot_de_passe: hash,
      role: "user",
    });

    // Redirection vers la connexion après inscription réussie
    res.redirect("/auth/login-page");
  } catch (err) {
    console.error("Erreur registerFormHandler :", err);
    res.status(500).render("auth/register", {
      title: "Inscription",
      error: "Erreur serveur. Réessaie plus tard.",
    });
  }
};

// GET /auth/logout
export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login-page");
  });
};