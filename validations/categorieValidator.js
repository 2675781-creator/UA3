import { body, param } from 'express-validator';

export const createCategorieValidation = [
  body('nom_categorie')
    .notEmpty().withMessage('Le nom de la catégorie est obligatoire'),
  body('description')
    .optional()
    .isLength({ max: 255 }).withMessage('La description doit contenir au maximum 255 caractères'),
];

export const updateCategorieValidation = [
  param('id_categorie')
    .isInt({ min: 1 }).withMessage('id_categorie invalide'),
  body('nom_categorie')
    .optional()
    .notEmpty().withMessage('Le nom de la catégorie ne peut pas être vide'),
  body('description')
    .optional()
    .isLength({ max: 255 }).withMessage('La description doit contenir au maximum 255 caractères'),
];