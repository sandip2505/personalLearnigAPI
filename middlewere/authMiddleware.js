const jwt = require("jsonwebtoken");
const User = require("../api/model/User");
const Role = require("../api/model/Role");
const RolePermission = require("../api/model/RolePermission");
const Permission = require("../api/model/Permission");

module.exports = {
  // Authentication middleware
  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      const user = await User.findById(decoded.id).populate("role_id");
      if (!user) {
        return res.status(401).json({ message: "Invalid token user" });
      }

      req.user.role = user.role_id; // attach role info
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized", error: err.message });
    }
  },

  // Authorization middleware (role-based + permission-based)
  checkPermission: (requiredPermissions = []) => {
    return async (req, res, next) => {
      try {
        const roleId = req.user.role._id;

        // Find role-permissions
        const rolePerm = await RolePermission.findOne({ role_id: roleId });
        if (!rolePerm) {
          return res.status(403).json({ message: "Role has no permissions" });
        }

        // Get permissions
        const permissions = await Permission.find({ _id: { $in: rolePerm.permission_id } });
        const userPermissions = permissions.map((p) => p.name);

        // Check if user has required permission(s)
        const hasPermission = requiredPermissions.every((perm) =>
          userPermissions.includes(perm)
        );

        if (!hasPermission) {
          return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }

        next();
      } catch (err) {
        return res.status(500).json({ message: "Error checking permissions", error: err.message });
      }
    };
  },
};
