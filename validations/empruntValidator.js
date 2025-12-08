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
    .isISO8601().withMessage('La date de retour doit être une date valide (YYYY-MM-DD)')
    .custom((value, {req}) => {
      if (value && req.body.date_emprunt && new Date(value) <= new Date(req.body.date_emprunt)){
          throw new Error('La date de retour doit être postérieure à la date emprunt.');
      }
      return true
    })
];

export const updateEmpruntValidation = [
  param('id_client') // adapte si ta route utilise un autre param (id_emprunt ?)
    .isInt({ min: 1 }).withMessage('ID client invalide dans URL'),
  
  param('id_article')
    .isInt({min: 1}).withMessage('ID article invalide dans URL'),

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
    .isISO8601().withMessage('La date de retour doit être une date valide (YYYY-MM-DD)')
    .custom((value, {req}) => {
      if(value && req.body.date_emprunt && new Date(value) <= new Date(req.body.date_emprunt)){
          throw new Error('La date de retour doit être postérieure à la date emprunt.');
      }
      return true;
    })
];