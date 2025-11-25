// validators/userValidator.js
const { body, param } = require('express-validator');

exports.createUserValidation = [
  body('email')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('nom')
    .notEmpty().withMessage('Le nom est obligatoire')
];

exports.updateUserValidation = [
  param('id')
    .isInt().withMessage('ID utilisateur invalide'),
  body('email')
    .optional()
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('nom')
    .optional()
    .notEmpty().withMessage('Le nom ne peut pas être vide')
];w