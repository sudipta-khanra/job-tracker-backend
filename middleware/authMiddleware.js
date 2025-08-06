import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // 2️⃣ Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // 3️⃣ Verify token using secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4️⃣ Find user from decoded token (id is stored in payload)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // 5️⃣ Attach user to request
      req.user = user;

      // 6️⃣ Continue to next middleware/route
      next();
    } catch (error) {
      console.error("❌ Token Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // 7️⃣ No token provided
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

export default protect;
