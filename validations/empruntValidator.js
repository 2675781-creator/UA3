import { body, param } from 'express-validator';

export const createEmpruntValidation = [
  body('id_client')
    .isInt({ min: 1 }).withMessage('id_client doit être un entier positif'),
  body('id_article')
    .isInt({ min: 1 }).withMessage('id_article doit être un entier positif'),
  body('date_emprunt')
    .notEmpty().withMessage('La date d’emprunt est obligatoire')
    .isISO8601().withMessage('La date d’emprunt doit être une date valide (YYYY-MM-DD)'),
  body('date_retour')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('La date de retour doit être une date valide (YYYY-MM-DD)'),
];

export const updateEmpruntValidation = [
  param('id') // adapte si ta route utilise un autre param (id_emprunt ?)
    .isInt({ min: 1 }).withMessage('ID d’emprunt invalide'),
  body('id_client')
    .optional()
    .isInt({ min: 1 }).withMessage('id_client doit être un entier positif'),
  body('id_article')
    .optional()
    .isInt({ min: 1 }).withMessage('id_article doit être un entier positif'),
  body('date_emprunt')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('La date d’emprunt doit être une date valide (YYYY-MM-DD)'),
  body('date_retour')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('La date de retour doit être une date valide (YYYY-MM-DD)'),
];