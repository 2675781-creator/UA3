import Article from "../modeles/Article.js"
import Client from "../modeles/Client.js"

// Lecture de la liste des Clients
export async function getAllClient(req, res) {
  try {
    const clients = await Client.findAll()
    //res.status(200).json({ message: "liste de tous les clients", data: clients })
    return res.render("clients/list-client", {
      clients,
      title: "Liste des clients",
      errors: []
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// formulaire pour ajouter un client
export const addClientForm = async (req, res) =>{
  try{
    
    const articles = await Article.findAll();
    return res.render("clients/add-client", {
      articles,
      errors: [],
      oldInput: {},
      
    });
  }
  catch(error){
    res.json({message:error.message})
  }
}

// formulaire pour modifier un client
export const editClientForm = async (req, res) =>{
 // const { id_client } = req.params;
  try{
    const clientFound = await Client.findByPk(req.params.id_client);
    const articles = await Article.findAll();

    if (!clientFound) {
      return res.status(404).render("clients/list-client", {
        errors: [{ msg: "Aucun client trouvé" }],
        clients: await Client.findAll(),
        title: "Liste des clients"
      });
    }

    return res.render("clients/edit-client", {
      clientData: clientFound,
      articles,
      title: "Modifier un client",
      errors: {},
      oldData: {}
    })
  }
  catch(error){
   // const articles = await Article.findAll()
   /* res.status(500).render("clients/list-client", {
      clients: await Client.findByPk(req.params.id_client),
      articles,
      errors: [{msg: error.message}],
      title: "Liste des clients"
    })*/
    res.status(500).send("Erreur serveur :" + error.message)
  }
}



// Création d'un Client
export const addClient = async (req, res) => {
  const newClient = req.body
  try {
    const existing = await Client.findOne({ where: { nom: newClient.nom } });
    if (existing) {
      const articles = await Article.findAll(); //recharger les articles
      return res.status(400).render("clients/add-client", {
        errors: [{ msg: "Un client avec ce nom existe déjà."}],
        oldInput: req.body, //conserver les valeurs saisies en cas d'erreur
        articles,
        title: "Ajouter un client"
      });
      //return res.status(400).json({
     //   message: "Un client avec ce nom existe déjà.",
      //});
    }

    await Client.create(newClient);
    return res.redirect("/clients"); //redirige vers la liste
    //res.status(201).json({ message: "Client ajouté avec succès", client })
  } catch (error) {
    const articles = await Article.findAll();
    return res.status(500).render("clients/add-client", {
      errors: [{ msg: error.message}],
      oldInput: req.body,
      articles,
      title: "Ajouter un client"
    });
  }
}

// Suppression d'un Client
export const deleteClient = async (req, res) => {
  const { id_client } = req.params

  // ICI tu testais `id` au lieu de `id_client`
  if (!id_client) {
    return res
      .status(400)
      .json({ error: true, message: "L'id du Client est requis" })
  }

  try {
    // ICI tu utilisais `id` au lieu de `id_client`
    const result = await Client.destroy({ where: { id_client } })

    if (result === 0) {
      // aucun client supprimé
      return res
        .status(404)
        .json({ message: `Aucun client trouvé avec l'id ${id_client}` })
    }
    return res.redirect("/clients")
    /*res
      .status(200)
      .json({ message: `Le client ${id_client} a été supprimé avec succès` })*/
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Voir le profil d'un Client par son numéro
export const getClientProfile = async (req, res) => {
  const { id_client } = req.params

  try {
    // ICI tu faisais `findByPk(id)` au lieu de `id_client`
    const client = await Client.findByPk(id_client, {
      include: [Article] // si relation définie
    });

    if (!client) {
      return res
        .status(404)
        .json({ message: `Aucun client trouvé avec l'id ${id_client}` })
    }
    return res.render("clients/profile-client", {
      client,
      title: "Profil du client",
      errors: []
    })
    //res.status(200).json({ message: "Profil d'un Client", data: client })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// Mise à jour d'un client

/*
export const updateClient = async (req, res) => {
  const { id_client } = req.params
  const { nom, prenom, article_prefere, id_article } = req.body;

  const updatedClient = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    article_prefere: req.body.article_prefere,
    id_article: req.body.id_article
  }

  if (!id_client) {
    return res
      .status(400)
      .json({ error: true, message: "L'id du Client est requis" })
  }

  try {
    const [nbUpdated] = await Client.update(updatedClient, {
      where: { id_client }
    })

    if (nbUpdated === 0) {
      return res
        .status(404)
        .json({ message: `Aucun client trouvé avec l'id ${id_client}` })
    }

    //  renvoyer le client mis à jour
    
    return res.redirect("/clients")
    res.status(200).json({
      message: `Client ${id_client} mis à jour avec succès`,
      data: client,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}*/

// Mise à jour d'un client
export const updateClient = async (req, res) => {
  const { id_client } = req.params;
  const { nom, prenom, article_prefere, id_article } = req.body;

  // 1. Validation : Check for empty fields
  let errors = {};
  if (!nom || nom.trim() === "") errors.nom = "Le nom est obligatoire";
  if (!prenom || prenom.trim() === "") errors.prenom = "Le prénom est obligatoire";

  // 2. If there are errors, re-display the form with the user's input (Sticky Form)
  if (Object.keys(errors).length > 0) {
    try {
      const articles = await Article.findAll(); // We need to reload the dropdown options
      const clientFound = { id_client, ...req.body }; // Construct a temporary client object for the form URL

      return res.render("clients/edit-client", {
        title: "Modifier un client",
        clientData: clientFound,      // Needed for the <form action="..."> URL
        articles,    // Needed for the dropdown list
        errors,      // Object containing error messages
        oldData: req.body // <--- THE KEY: Pass back what the user typed
      });
    } catch (error) {
      return res.status(500).send("Erreur lors du chargement du formulaire : " + error.message);
    }
  }

  // 3. If no errors, proceed with the update
  try {
    const updatedClient = { nom, prenom, article_prefere, id_article };
    
    const [nbUpdated] = await Client.update(updatedClient, {
      where: { id_client }
    });

    if (nbUpdated === 0) {
      // Edge case: Client ID doesn't exist in DB
      return res.status(404).render("clients/list-client", {
          errors: [{ msg: "Aucun client trouvé pour la mise à jour." }],
          clients: await Client.findAll(),
          title: "Liste des clients"
      });
    }

    // Success! Redirect to the list
    return res.redirect("/clients");

  } catch (error) {
    // Database error handling
    try {
        const articles = await Article.findAll();
        return res.status(500).render("clients/edit-client", {
            title: "Modifier un client",
            clientData: { id_client, ...req.body }, 
            articles,
            errors: { general: "Erreur base de données: " + error.message },
            oldData: req.body
        });
    } catch (err) {
        return res.status(500).send("Erreur critique : " + err.message);
    }
  }
}