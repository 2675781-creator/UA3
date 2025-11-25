import { body, param } from 'express-validator';

export const createArticleValidation = [
  body('titre')
    .notEmpty().withMessage('Le titre est obligatoire')
    .isLength({ max: 255 }).withMessage('Le titre doit contenir au maximum 255 caractères'),
  body('date_publication')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('La date de publication doit être une date valide (YYYY-MM-DD)'),
  body('status')
    .notEmpty().withMessage('Le statut est obligatoire')
    .isIn(['disponible', 'indisponible']) 
    .withMessage('Le statut doit être "disponible", "indisponible" ou "reserve"'),
  body('quantite')
    .isInt({ min: 0 }).withMessage('La quantité doit être un entier positif ou nul'),
  body('id_auteur')
    .isInt({ min: 1 }).withMessage('id_auteur doit être un entier positif'),
  body('id_categorie')
    .isInt({ min: 1 }).withMessage('id_categorie doit être un entier positif'),
  body('id_employe')
    .isInt({ min: 1 }).withMessage('id_employe doit être un entier positif'),
];

export const updateArticleValidation = [
  param('id_article')
    .isInt({ min: 1 }).withMessage('id_article invalide'),
  body('titre')
    .optional()
    .notEmpty().withMessage('Le titre ne peut pas être vide'),
  body('date_publication')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('La date de publication doit être une date valide (YYYY-MM-DD)'),
  body('status')
    .optional()
    .isIn(['disponible', 'indisponible', 'reserve'])
    .withMessage('Le statut doit être "disponible", "indisponible" ou "reserve"'),
  body('quantite')
    .optional()
    .isInt({ min: 0 }).withMessage('La quantité doit être un entier positif ou nul'),
  body('id_auteur')
    .optional()
    .isInt({ min: 1 }).withMessage('id_auteur doit être un entier positif'),
  body('id_categorie')
    .optional()
    .isInt({ min: 1 }).withMessage('id_categorie doit être un entier positif'),
  body('id_employe')
    .optional()
    .isInt({ min: 1 }).withMessage('id_employe doit être un entier positif'),
];