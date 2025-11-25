// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../modeles/User.js"; 

export const register = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);

    const user = await User.create({
      nom,
      prenom,
      email,
      mot_de_passe: hash,
      role,
    });

    res.status(201).json({
      id_user: user.id_user,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!match) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign(
      {
        id_user: user.id_user,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.json({
      token,
      user: {
        id_user: user.id_user,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["mot_de_passe"] }, 
    });

    res.status(200).json({
      message: "Liste de tous les utilisateurs",
      data: users,
    });
  } catch (error) {
    console.error("Erreur getAllUsers :", error);
    res.status(500).json({ message: error.message });
  }
}