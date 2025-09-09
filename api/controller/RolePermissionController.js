const Role = require('../model/Role');
const Permissions = require('../model/Permission');
const RolePermission = require('../model/RolePermission');

const RolePermissionController = {}

// Role Controller methods
RolePermissionController.getRoles = async (req, res) => {
    try {
        const roles = await Role.find({ deletedAt: null }).sort({ createdAt: -1 });
        res.status(200).json(roles);
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.createRole = async (req, res) => {
    try {
        const newRole = new Role(req.body);
        await newRole.save();
        res.status(201).send("Role created successfully");
    } catch (error) {
        console.error("Error creating role:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.editRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).send("Role not found");
        }
        res.status(200).json(role);
    } catch (error) {
        console.error("Error fetching role API:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.updateRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!role) {
            return res.status(404).send("Role not found");
        }
        res.send("Role updated successfully");
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, { deletedAt: new Date() }, { new: true });
        if (!role) {
            return res.status(404).send("Role not found");
        }
        res.send("Role deleted successfully");
    } catch (error) {
        console.error("Error deleting role:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.getRolePermissionsByRoleId = async (req, res) => {
    try {
        const roleId = req.params.id;
        const rolePermissions = await RolePermission.find({ role_id: roleId }).populate('permission_id');

        res.status(200).json(rolePermissions);
    } catch (error) {
        console.error("Error fetching role permissions:", error);
        res.status(500).send("Internal Server Error");
    }
}

// Permissions Controller methods
RolePermissionController.getPermissions = async (req, res) => {
    try {
        const permissions = await Permissions.find({ deletedAt: null }).sort({ createdAt: -1 });
        res.status(200).json(permissions);
    } catch (error) {
        console.error("Error fetching permissions:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.createPermission = async (req, res) => {
    try {
        const newPermission = new Permissions(req.body);
        await newPermission.save();
        res.status(201).send("Permission created successfully");
    } catch (error) {
        console.error("Error creating permission:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.editPermission = async (req, res) => {
    try {
        const permission = await Permissions.findById(req.params.id);
        if (!permission) {
            return res.status(404).send("Permission not found");
        }
        res.status(200).json(permission);
    } catch (error) {
        console.error("Error fetching permission:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.updatePermission = async (req, res) => {
    try {
        const permission = await Permissions.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!permission) {
            return res.status(404).send("Permission not found");
        }
        res.send("Permission updated successfully");
    } catch (error) {
        console.error("Error updating permission:", error);
        res.status(500).send("Internal Server Error");
    }
}
RolePermissionController.deletePermission = async (req, res) => {
    try {
        const permission = await Permissions.findByIdAndUpdate(req.params.id, { deletedAt: new Date() }, { new: true });
        if (!permission) {
            return res.status(404).send("Permission not found");
        }
        res.send("Permission deleted successfully");
    } catch (error) {
        console.error("Error deleting permission:", error);
        res.status(500).send("Internal Server Error");
    }
}

// RolePermissionController methods
RolePermissionController.getRolePermissions = async (req, res) => {
    try {
        const rolePermissions = await RolePermission.find().populate('role_id').populate('permission_id');
        res.status(200).json(rolePermissions);
    } catch (error) {
        console.error("Error fetching role permissions:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.createRolePermission = async (req, res) => {
    try {
        const { role_id, ...updateData } = req.body;

        if (!role_id) {
            return res.status(400).send("role_id is required");
        }

        // Check if role_id already exists
        const existingRole = await RolePermission.findOne({ role_id });

        if (existingRole) {
            // Update existing
            await RolePermission.updateOne(
                { role_id },
                { $set: updateData }
            );
            return res.status(200).send("Role-Permission updated successfully");
        } else {
            // Create new
            const newRolePermission = new RolePermission(req.body);
            await newRolePermission.save();
            return res.status(201).send("Role-Permission created successfully");
        }

    } catch (error) {
        console.error("Error creating/updating role-permission:", error);
        res.status(500).send("Internal Server Error");
    }
};


RolePermissionController.editRolePermission = async (req, res) => {
    try {
        const rolePermission = await RolePermission.findById(req.params.id);
        if (!rolePermission) {
            return res.status(404).send("Role-Permission not found");
        }
        res.status(200).json(rolePermission);
    } catch (error) {
        console.error("Error fetching role-permission:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.updateRolePermission = async (req, res) => {
    try {
        const rolePermission = await RolePermission.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!rolePermission) {
            return res.status(404).send("Role-Permission not found");
        }
        res.send("Role-Permission updated successfully");
    } catch (error) {
        console.error("Error updating role-permission:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.deleteRolePermission = async (req, res) => {
    try {
        const rolePermission = await RolePermission.findByIdAndUpdate(req.params.id, { deleted_at: new Date() }, { new: true });
        if (!rolePermission) {
            return res.status(404).send("Role-Permission not found");
        }
        res.send("Role-Permission deleted successfully");
    } catch (error) {
        console.error("Error deleting role-permission:", error);
        res.status(500).send("Internal Server Error");
    }
}



RolePermissionController.findByRoleId = async (req, res) => {
    try {
        const roleId = req.params.id;

        let rolePermissions = await RolePermission.findOne({ role_id: roleId })
            .populate('permission_id', '_id name'); // This will now populate the _id and name


        res.status(200).json(rolePermissions);
    } catch (error) {
        console.error("Error fetching role permissions by role ID:", error);
        res.status(500).send("Internal Server Error");
    }
};



RolePermissionController.insertMany = async (req, res) => {
    try {
        const roles = [
            {
                "name": "Admin",
                "description": "Full access to all modules"
            },
            {
                "name": "Editor",
                "description": "Can manage content but not user/role permissions"
            },
            {
                "name": "Viewer",
                "description": "Can only view content"
            }
        ]
        const permissions = [
            { "name": "view_media", "description": "View Media" },
            { "name": "create_media", "description": "Create Media" },
            { "name": "update_media", "description": "Update Media" },
            { "name": "delete_media", "description": "Delete Media" },

            { "name": "view_pages", "description": "View Pages" },
            { "name": "create_pages", "description": "Create Pages" },
            { "name": "update_pages", "description": "Update Pages" },
            { "name": "delete_pages", "description": "Delete Pages" },

            { "name": "view_sections", "description": "View Sections" },
            { "name": "create_sections", "description": "Create Sections" },
            { "name": "update_sections", "description": "Update Sections" },
            { "name": "delete_sections", "description": "Delete Sections" },

            { "name": "view_pagesection", "description": "View PageSection" },
            { "name": "create_pagesection", "description": "Create PageSection" },
            { "name": "update_pagesection", "description": "Update PageSection" },
            { "name": "delete_pagesection", "description": "Delete PageSection" },

            { "name": "view_blogs", "description": "View Blogs" },
            { "name": "create_blogs", "description": "Create Blogs" },
            { "name": "update_blogs", "description": "Update Blogs" },
            { "name": "delete_blogs", "description": "Delete Blogs" },

            { "name": "view_slider", "description": "View Slider" },
            { "name": "create_slider", "description": "Create Slider" },
            { "name": "update_slider", "description": "Update Slider" },
            { "name": "delete_slider", "description": "Delete Slider" },

            { "name": "view_footers", "description": "View Footers" },
            { "name": "create_footers", "description": "Create Footers" },
            { "name": "update_footers", "description": "Update Footers" },
            { "name": "delete_footers", "description": "Delete Footers" },

            { "name": "view_headers", "description": "View Headers" },
            { "name": "create_headers", "description": "Create Headers" },
            { "name": "update_headers", "description": "Update Headers" },
            { "name": "delete_headers", "description": "Delete Headers" },

            { "name": "view_users", "description": "View Users" },
            { "name": "create_users", "description": "Create Users" },
            { "name": "update_users", "description": "Update Users" },
            { "name": "delete_users", "description": "Delete Users" },

            { "name": "view_roles", "description": "View Roles" },
            { "name": "create_roles", "description": "Create Roles" },
            { "name": "update_roles", "description": "Update Roles" },
            { "name": "delete_roles", "description": "Delete Roles" },

            { "name": "view_permissions", "description": "View Permissions" },
            { "name": "create_permissions", "description": "Create Permissions" },
            { "name": "update_permissions", "description": "Update Permissions" },
            { "name": "delete_permissions", "description": "Delete Permissions" }
        ]

        const newRolePermissions = await Role.insertMany(roles);
        console.log(`Inserted ${newRolePermissions.length} roles.`);
        const newPermissions = await Permissions.insertMany(permissions);
        console.log(`Inserted ${newPermissions.length} permissions.`);
        res.status(201).json("Roles and permissions inserted successfully");
    } catch (error) {
        console.error("Error inserting role-permissions:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = RolePermissionController;
