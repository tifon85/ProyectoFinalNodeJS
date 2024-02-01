export const authMiddleware = (roles) => {
    return (req, res, next) => {
      console.log("1")
      console.log(req)
      console.log("2")
      if (roles.includes("PUBLIC")) {
        return next();
      }
      if (!roles.includes(req.user.role)) {
        return res.status(403).json("Not authorized");
      }
      next();
    };
  };