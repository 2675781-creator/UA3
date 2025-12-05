// middlewares/pageAuthMiddleware.js

// Vérifie qu'un utilisateur est connecté (session)
export function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/auth/login-page");
  }
  next();
}

// Vérifie que l'utilisateur (en session) a un des rôles donnés
export function requireRole(...rolesAutorises) {
  return (req, res, next) => {
    const user = req.session.user;

    if (!user) {
      return res.redirect("/auth/login-page");
    }

    if (!rolesAutorises.includes(user.role)) {
      return res.status(403).render("403", {
        title: "Accès interdit",
      });
    }

    next();
  };
}