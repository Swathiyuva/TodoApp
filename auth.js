// import jwt from "jsonwebtoken";

// const auth = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(400).json({ error: "Missing or invalid token" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(400).json({ error: "Invalid token" });
//   }
// };

// export default auth;


// middleware/auth.js
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // uses .env secret
    req.user = decoded; // attaches user info (like email) to request
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid token" });
  }
};

export default auth;
