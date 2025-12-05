// controllers/auteurPageController.js
import { Auteur, Article } from "../modeles/relations.js";

/**
 * Liste des auteurs
 */
export async function listeAuteursPage(req, res, next) {
  try {
    const auteurs = await Auteur.findAll({
      order: [
        ["nom", "ASC"],
        ["prenom", "ASC"],
      ],
    });

    res.render("auteurs/list-auteur", {
      title: "Liste des auteurs",
      auteurs,
      // pour une meilleure UI
      successMessage:
        (req.flash && req.flash("success")[0]) || null,
      errorMessage:
        (req.flash && req.flash("error")[0]) || null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Formulaire d'ajout d'auteur
 */
export async function afficherFormulaireAjoutAuteur(req, res, next) {
  try {
    res.render("auteurs/add-auteur", {
      title: "Nouvel auteur",
      erreur: null, // ancien champ global
      errorMessage: null, // nouveau champ plus explicite
      fieldErrors: {}, // erreurs par champ pour l'UI
      old: {}, // valeurs déjà saisies
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Création d'un auteur depuis la page
 */
export async function creerAuteurDepuisPage(req, res, next) {
  try {
    const { nom, prenom, age, nationalite, langue } = req.body;

    const erreurs = [];
    const fieldErrors = {};

    if (!nom) {
      erreurs.push("Le nom est obligatoire.");
      fieldErrors.nom = "Le nom est obligatoire.";
    }
    if (!prenom) {
      erreurs.push("Le prénom est obligatoire.");
      fieldErrors.prenom = "Le prénom est obligatoire.";
    }
    if (!age) {
      erreurs.push("L'âge est obligatoire.");
      fieldErrors.age = "L'âge est obligatoire.";
    }
    if (!nationalite) {
      erreurs.push("La nationalité est obligatoire.");
      fieldErrors.nationalite = "La nationalité est obligatoire.";
    }
    if (!langue) {
      erreurs.push("La langue est obligatoire.");
      fieldErrors.langue = "La langue est obligatoire.";
    }

    if (erreurs.length > 0) {
      return res.status(400).render("auteurs/add-auteur", {
        title: "Nouvel auteur",
        erreur: erreurs.join(" "), // compatibilité avec ancienne vue
        errorMessage:
          "Certains champs sont invalides. Corrigez les erreurs ci‑dessous.",
        fieldErrors,
        old: { nom, prenom, age, nationalite, langue },
      });
    }

    const existe = await Auteur.findOne({ where: { nom, prenom } });
    if (existe) {
      return res.status(400).render("auteurs/add-auteur", {
        title: "Nouvel auteur",
        erreur: "Un auteur avec ce nom et ce prénom existe déjà.",
        errorMessage: "Un auteur avec ce nom et ce prénom existe déjà.",
        fieldErrors: { nom: "Auteur déjà existant", prenom: "Auteur déjà existant" },
        old: { nom, prenom, age, nationalite, langue },
      });
    }

    const nouvelAuteur = await Auteur.create({
      nom,
      prenom,
      age: Number(age),
      nationalite,
      langue,
    });

    if (req.flash) {
      req.flash(
        "success",
        `L'auteur ${nouvelAuteur.prenom} ${nouvelAuteur.nom} a été créé avec succès.`
      );
    }

    res.redirect(`/auteurs/${nouvelAuteur.id_auteur}`);
  } catch (error) {
    next(error);
  }
}

/**
 * Profil d'un auteur
 */
export async function afficherProfilAuteur(req, res, next) {
  try {
    const id = Number(req.params.id);

    const auteur = await Auteur.findByPk(id, {
      include: [{ model: Article, as: "Articles" }],
    });

    if (!auteur) {
      return res.status(404).render("404", {
        title: "Auteur introuvable",
      });
    }

    res.render("auteurs/profil", {
      title: `Profil de ${auteur.prenom} ${auteur.nom}`,
      auteur,
      articles: auteur.Articles || [],
      erreur: null,
      errorMessage:
        (req.flash && req.flash("error")[0]) || null,
      successMessage:
        (req.flash && req.flash("success")[0]) || null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Formulaire d'édition d'un auteur
 */
export async function afficherFormulaireEditionAuteur(req, res, next) {
  try {
    const id = Number(req.params.id);
    const auteur = await Auteur.findByPk(id);

    if (!auteur) {
      return res.status(404).render("404", {
        title: "Auteur introuvable",
      });
    }

    res.render("auteurs/edit-auteur", {
      title: "Modifier un auteur",
      auteur,
      erreur: null,
      errorMessage: null,
      fieldErrors: {},
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Mise à jour d'un auteur
 */
export async function mettreAJourAuteurDepuisPage(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { nom, prenom, age, nationalite, langue } = req.body;

    const auteur = await Auteur.findByPk(id);
    if (!auteur) {
      return res.status(404).render("404", {
        title: "Auteur introuvable",
      });
    }

    const erreurs = [];
    const fieldErrors = {};

    if (!nom) {
      erreurs.push("Le nom est obligatoire.");
      fieldErrors.nom = "Le nom est obligatoire.";
    }
    if (!prenom) {
      erreurs.push("Le prénom est obligatoire.");
      fieldErrors.prenom = "Le prénom est obligatoire.";
    }
    if (!age) {
      erreurs.push("L'âge est obligatoire.");
      fieldErrors.age = "L'âge est obligatoire.";
    }
    if (!nationalite) {
      erreurs.push("La nationalité est obligatoire.");
      fieldErrors.nationalite = "La nationalité est obligatoire.";
    }
    if (!langue) {
      erreurs.push("La langue est obligatoire.");
      fieldErrors.langue = "La langue est obligatoire.";
    }

    if (erreurs.length > 0) {
      return res.status(400).render("auteurs/edit-auteur", {
        title: "Modifier un auteur",
        auteur: {
          ...auteur.toJSON(),
          nom,
          prenom,
          age,
          nationalite,
          langue,
        },
        erreur: erreurs.join(" "),
        errorMessage:
          "Certains champs sont invalides. Corrigez les erreurs ci‑dessous.",
        fieldErrors,
      });
    }

    await auteur.update({
      nom,
      prenom,
      age: Number(age),
      nationalite,
      langue,
    });

    if (req.flash) {
      req.flash(
        "success",
        `L'auteur ${auteur.prenom} ${auteur.nom} a été mis à jour avec succès.`
      );
    }

    res.redirect(`/auteurs/${id}`);
  } catch (error) {
    next(error);
  }
}

/**
 * Suppression d'un auteur
 */
export async function supprimerAuteurDepuisPage(req, res, next) {
  try {
    const id = Number(req.params.id);

    const auteur = await Auteur.findByPk(id, {
      include: [{ model: Article, as: "Articles" }],
    });

    if (!auteur) {
      return res.status(404).render("404", {
        title: "Auteur introuvable",
      });
    }

    const nbArticles = auteur.Articles ? auteur.Articles.length : 0;
    if (nbArticles > 0) {
      return res.status(400).render("auteurs/profil", {
        title: `Profil de ${auteur.prenom} ${auteur.nom}`,
        auteur,
        articles: auteur.Articles,
        erreur:
          "Impossible de supprimer un auteur qui a encore des articles.",
        errorMessage:
          "Impossible de supprimer un auteur qui a encore des articles.",
        successMessage: null,
      });
    }

    await Auteur.destroy({ where: { id_auteur: id } });

    if (req.flash) {
      req.flash(
        "success",
        `L'auteur ${auteur.prenom} ${auteur.nom} a été supprimé avec succès.`
      );
    }

    res.redirect("/auteurs");
  } catch (error) {
    next(error);
  }
}