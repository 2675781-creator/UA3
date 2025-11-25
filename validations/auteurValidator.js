import { body, param } from 'express-validator';

export const createAuteurValidation = [
  body('nom')
    .notEmpty().withMessage('Le nom est obligatoire'),
  body('prenom')
    .notEmpty().withMessage('Le prénom est obligatoire'),
  body('age')
    .isInt({ min: 0 }).withMessage('L’âge doit être un entier positif'),
  body('nationalite')
    .notEmpty().withMessage('La nationalité est obligatoire'),
  body('langue')
    .notEmpty().withMessage('La langue est obligatoire'),
];

export const updateAuteurValidation = [
  param('id_auteur')
    .isInt({ min: 1 }).withMessage('id_auteur invalide'),
  body('nom')
    .optional()
    .notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('prenom')
    .optional()
    .notEmpty().withMessage('Le prénom ne peut pas être vide'),
  body('age')
    .optional()
    .isInt({ min: 0 }).withMessage('L’âge doit être un entier positif'),
  body('nationalite')
    .optional()
    .notEmpty().withMessage('La nationalité ne peut pas être vide'),
  body('langue')
    .optional()
    .notEmpty().withMessage('La langue ne peut pas être vide'),
];