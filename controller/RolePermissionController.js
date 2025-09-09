const axios = require('axios');

const RolePermissionController = {}

// Role Controller methods
RolePermissionController.getRoles = async (req, res) => {
    try {
        const roles = await axios.get(`${process.env.API_URL}/api/roles`);
        res.render('roles', { title: 'Roles', layout: 'partials/layout-vertical', roles: roles.data });
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.addRole = (req, res) => {
    res.render('add-role', { title: 'Add Role', layout: 'partials/layout-vertical' });
}

RolePermissionController.createRole = async (req, res) => {
    try {
        await axios.post(`${process.env.API_URL}/api/createRole`, req.body);
        res.redirect('/roles');
    } catch (error) {
        console.error("Error creating role:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.editRole = async (req, res) => {
    try {
        const role = await axios.get(`${process.env.API_URL}/api/editRole/${req.params.id}`);
        if (!role) {
            return res.status(404).send("Role not found");
        }
        res.render('edit-role', { title: 'Edit Role', layout: 'partials/layout-vertical', role: role.data });
    } catch (error) {
        console.error("Error fetching role:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.updateRole = async (req, res) => {
    try {
        await axios.put(`${process.env.API_URL}/api/updateRole/${req.params.id}`, req.body);
        res.redirect('/roles');
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).send("Internal Server Error");
    }
}

// Permissions Controller methods
RolePermissionController.getPermissions = async (req, res) => {
    try {
        const permissions = await axios.get(`${process.env.API_URL}/api/permissions`);
        res.render('permissions', { title: 'Permissions', layout: 'partials/layout-vertical', permissions: permissions.data });
    } catch (error) {
        console.error("Error fetching permissions:", error);
        res.status(500).send("Internal Server Error");
    }
}
RolePermissionController.addPermission = (req, res) => {
    res.render('add-permission', { title: 'Add Permission', layout: 'partials/layout-vertical' });
}
RolePermissionController.createPermission = async (req, res) => {
    try {
        await axios.post(`${process.env.API_URL}/api/createPermission`, req.body);
        res.redirect('/permissions');
    } catch (error) {
        console.error("Error creating permission:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.editPermission = async (req, res) => {
    try {
        const permission = await axios.get(`${process.env.API_URL}/api/editPermission/${req.params.id}`);
        if (!permission) {
            return res.status(404).send("Permission not found");
        }
        res.render('edit-permission', { title: 'Edit Permission', layout: 'partials/layout-vertical', permission: permission.data });
    } catch (error) {
        console.error("Error fetching permission:", error);
        res.status(500).send("Internal Server Error");
    }
}

RolePermissionController.updatePermission = async (req, res) => {
    try {
        await axios.put(`${process.env.API_URL}/api/updatePermission/${req.params.id}`, req.body);
        res.redirect('/permissions');
    } catch (error) {
        console.error("Error updating permission:", error);
        res.status(500).send("Internal Server Error");
    }
};


RolePermissionController.getRolePermissions = async (req, res) => {
    try {
        const roleId = req.params.id;

        // Get all permissions
        const Permissions = await axios.get(`${process.env.API_URL}/api/permissions`);

        // Get role's assigned permissions
        const rolePermissionsRes = await axios.get(`${process.env.API_URL}/api/findbyrole/${roleId}`);

        let assignedPermissionIds = [];
        if (rolePermissionsRes.data && rolePermissionsRes.data.permission_id) {
            assignedPermissionIds = rolePermissionsRes.data.permission_id.map(id => id.toString());
        }

        res.render('role-permissions', {
            title: 'Role Permissions',
            layout: 'partials/layout-vertical',
            roleId,
            permissions: Permissions.data,
            assignedPermissionIds // passing only array of IDs
        });
    } catch (error) {
        console.error("Error fetching role permissions:", error);
        res.status(500).send("Internal Server Error");
    }
};

RolePermissionController.createRolePermission = async (req, res) => {
    console.log("Permissions:", req.body.permissions, "Role ID:", req.params.id);
    try {
        const role_id = req.params.id;
        const { permissions } = req.body;
        const payload={
            role_id,
            permission_id: Array.isArray(permissions) ? permissions : [permissions]
        }
        await axios.post(`${process.env.API_URL}/api/createRolePermission`, payload);
        res.redirect(`/role-permission/${role_id}`);
    } catch (error) {
        console.error("Error creating role permission:", error);
        res.status(500).send("Internal Server Error");
    }
}


module.exports = RolePermissionController;