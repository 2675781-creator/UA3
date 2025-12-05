// controllers/auteurPageController.js
import { Auteur, Article } from "../modeles/relations.js";

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
    });
  } catch (error) {
    next(error);
  }
}

export async function afficherFormulaireAjoutAuteur(req, res, next) {
  try {
    res.render("auteurs/add-auteur", {
      title: "Nouvel auteur",
      erreur: null,
      old: {},
    });
  } catch (error) {
    next(error);
  }
}

export async function creerAuteurDepuisPage(req, res, next) {
  try {
    const { nom, prenom, age, nationalite, langue } = req.body;

    const erreurs = [];
    if (!nom) erreurs.push("Le nom est obligatoire.");
    if (!prenom) erreurs.push("Le prénom est obligatoire.");
    if (!age) erreurs.push("L'âge est obligatoire.");
    if (!nationalite) erreurs.push("La nationalité est obligatoire.");
    if (!langue) erreurs.push("La langue est obligatoire.");

    if (erreurs.length > 0) {
      return res.status(400).render("auteurs/add-auteur", {
        title: "Nouvel auteur",
        erreur: erreurs.join(" "),
        old: { nom, prenom, age, nationalite, langue },
      });
    }

    const existe = await Auteur.findOne({ where: { nom, prenom } });
    if (existe) {
      return res.status(400).render("auteurs/add-auteur", {
        title: "Nouvel auteur",
        erreur: "Un auteur avec ce nom et ce prénom existe déjà.",
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

    res.redirect(`/auteurs/${nouvelAuteur.id_auteur}`);
  } catch (error) {
    next(error);
  }
}

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
    });
  } catch (error) {
    next(error);
  }
}

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
    });
  } catch (error) {
    next(error);
  }
}

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
    if (!nom) erreurs.push("Le nom est obligatoire.");
    if (!prenom) erreurs.push("Le prénom est obligatoire.");
    if (!age) erreurs.push("L'âge est obligatoire.");
    if (!nationalite) erreurs.push("La nationalité est obligatoire.");
    if (!langue) erreurs.push("La langue est obligatoire.");

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
      });
    }

    await auteur.update({
      nom,
      prenom,
      age: Number(age),
      nationalite,
      langue,
    });

    res.redirect(`/auteurs/${id}`);
  } catch (error) {
    next(error);
  }
}

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
      });
    }

    await Auteur.destroy({ where: { id_auteur: id } });

    res.redirect("/auteurs");
  } catch (error) {
    next(error);
  }
}