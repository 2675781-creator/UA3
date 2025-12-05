// middlewares/requireAuth.js

// doit être connecté
export function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/auth/login-page");
  }
  next();
}

// doit avoir un rôle parmi ceux autorisés
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