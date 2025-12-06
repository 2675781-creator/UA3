import { body, param } from 'express-validator';

export const createClientValidation = [
  body('nom')
    .notEmpty().withMessage('Le nom est obligatoire'),
  body('prenom')
    .notEmpty().withMessage('Le prénom est obligatoire'),
  body('article_prefere')
    .notEmpty().withMessage('L’article préféré est obligatoire'),
  body('id_article')
    .notEmpty().withMessage("Veuillez sélectionner un article")
    .isInt({ min: 1 }).withMessage('ID article doit être un entier positif'),
];

export const updateClientValidation = [
  param('id_client')
    .isInt({ min: 1 }).withMessage('id_client invalide'),
  body('nom')
    .optional()
    .notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('prenom')
    .optional()
    .notEmpty().withMessage('Le prénom ne peut pas être vide'),
  body('article_prefere')
    .optional()
    .notEmpty().withMessage('L’article préféré ne peut pas être vide'),
  body('id_article')
    .optional()
    .isInt({ min: 1 }).withMessage('ID article doit être un entier positif'),
];