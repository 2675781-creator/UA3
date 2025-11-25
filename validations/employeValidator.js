import { body, param } from 'express-validator';

export const createEmployeValidation = [
  body('nom')
    .notEmpty().withMessage('Le nom est obligatoire'),
  body('prenom')
    .notEmpty().withMessage('Le prénom est obligatoire'),
  body('age')
    .isInt({ min: 16 }).withMessage('L’âge doit être un entier supérieur ou égal à 16'),
  body('role')
    .notEmpty().withMessage('Le rôle est obligatoire'),
  body('date_embauche')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('La date d’embauche doit être une date valide (YYYY-MM-DD)')
    .custom((value) => {
      const embauche = new Date(value);
      const aujourdHui = new Date();
      // on met l’heure à 00:00 pour comparer uniquement les dates
      aujourdHui.setHours(0, 0, 0, 0);
      embauche.setHours(0, 0, 0, 0);

      if (embauche > aujourdHui) {
        throw new Error('La date d’embauche ne peut pas être dans le futur');
      }
      return true;
    }),
  body('numero_tache')
    .isInt({ min: 1 }).withMessage('Le numéro de tâche doit être un entier positif'),
];

export const updateEmployeValidation = [
  param('id_employe')
    .isInt({ min: 1 }).withMessage('id_employe invalide'),
  body('nom')
    .optional()
    .notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('prenom')
    .optional()
    .notEmpty().withMessage('Le prénom ne peut pas être vide'),
  body('age')
    .optional()
    .isInt({ min: 16 }).withMessage('L’âge doit être un entier supérieur ou égal à 16'),
  body('role')
    .optional()
    .notEmpty().withMessage('Le rôle ne peut pas être vide'),
  body('date_embauche')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('La date d’embauche doit être une date valide (YYYY-MM-DD)')
    .custom((value) => {
      const embauche = new Date(value);
      const aujourdHui = new Date();
      aujourdHui.setHours(0, 0, 0, 0);
      embauche.setHours(0, 0, 0, 0);

      if (embauche > aujourdHui) {
        throw new Error('La date d’embauche ne peut pas être dans le futur');
      }
      return true;
    }),
  body('numero_tache')
    .optional()
    .isInt({ min: 1 }).withMessage('Le numéro de tâche doit être un entier positif'),
];