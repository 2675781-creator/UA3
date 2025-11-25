import Client from "../modeles/Client.js"

// Lecture de la liste des Clients
export async function getAllClient(req, res) {
  try {
    const clients = await Client.findAll()
    res.status(200).json({ message: "liste de tous les clients", data: clients })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Création d'un Client
export const addClient = async (req, res) => {
  const newClient = req.body
  try {
    const client = await Client.create(newClient)
    res.status(201).json({ message: "Client ajouté avec succès", client })
  } catch (error) {
    res.status(400).json({ message: error.message })
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

    res
      .status(200)
      .json({ message: `Le client ${id_client} a été supprimé avec succès` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Voir le profil d'un Client par son numéro
export const getClientProfile = async (req, res) => {
  const { id_client } = req.params

  try {
    // ICI tu faisais `findByPk(id)` au lieu de `id_client`
    const client = await Client.findByPk(id_client)

    if (!client) {
      return res
        .status(404)
        .json({ message: `Aucun client trouvé avec l'id ${id_client}` })
    }

    res.status(200).json({ message: "Profil d'un Client", data: client })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mise à jour d'un client
export const updateClient = async (req, res) => {
  const { id_client } = req.params
  const updatedClient = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    article_prefere: req.body.article_prefere,
  }

  if (!id_client) {
    return res
      .status(400)
      .json({ error: true, message: "L'id du Client est requis" })
  }

  try {
    const [nbUpdated] = await Client.update(updatedClient, {
      where: { id_client },
    })

    if (nbUpdated === 0) {
      return res
        .status(404)
        .json({ message: `Aucun client trouvé avec l'id ${id_client}` })
    }

    //  renvoyer le client mis à jour
    const client = await Client.findByPk(id_client)
    res.status(200).json({
      message: `Client ${id_client} mis à jour avec succès`,
      data: client,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}