const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Import your models
const Role = require("../api/model/Role"); // Adjust path as needed
const Permission = require("../api/model/Permission"); // Adjust path as needed
const RolePermission = require("../api/model/RolePermission"); // Adjust path as needed
const User = require("../api/model/User"); // Adjust path as needed

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Sample data
const rolesData = [
  {
    name: "Super Admin",
    description: "Full system access with all permissions",
  },
  {
    name: "Admin",
    description: "Administrative access with most permissions",
  },
  {
    name: "Teacher",
    description: "Management level access with limited permissions",
  },
  {
    name: "Student",
    description: "Basic Student access with read permissions",
  }
];

const permissionsData = [
  // User Management
  { name: "user_create", description: "Create new users" },
  { name: "user_read", description: "View user information" },
  { name: "user_update", description: "Update user information" },
  { name: "user_delete", description: "Delete users" },
  
  // Role Management
  { name: "role_create", description: "Create new roles" },
  { name: "role_read", description: "View role information" },
  { name: "role_update", description: "Update role information" },
  { name: "role_delete", description: "Delete roles" },
  
  // Permission Management
  { name: "permission_create", description: "Create new permissions" },
  { name: "permission_read", description: "View permission information" },
  { name: "permission_update", description: "Update permission information" },
  { name: "permission_delete", description: "Delete permissions" },
  
  // Content Management
  { name: "content_create", description: "Create content" },
  { name: "content_read", description: "View content" },
  { name: "content_update", description: "Update content" },
  { name: "content_delete", description: "Delete content" },
  
  // System Settings
  { name: "settings_read", description: "View system settings" },
  { name: "settings_update", description: "Update system settings" },
  
  // Reports
  { name: "reports_read", description: "View reports" },
  { name: "reports_create", description: "Generate reports" },
];

// Role-Permission mappings
const rolePermissionMappings = {
  "Super Admin": [
    "user_create", "user_read", "user_update", "user_delete",
    "role_create", "role_read", "role_update", "role_delete",
    "permission_create", "permission_read", "permission_update", "permission_delete",
    "content_create", "content_read", "content_update", "content_delete",
    "settings_read", "settings_update",
    "reports_read", "reports_create"
  ],
  "Admin": [
    "user_create", "user_read", "user_update",
    "role_read",
    "permission_read",
    "content_create", "content_read", "content_update", "content_delete",
    "settings_read",
    "reports_read", "reports_create"
  ],
  "Manager": [
    "user_read", "user_update",
    "content_create", "content_read", "content_update",
    "reports_read"
  ],
  "User": [
    "content_read",
    "reports_read"
  ],
  "Guest": [
    "content_read"
  ]
};

const usersData = [
  {
    name: "Super Administrator",
    username: "superadmin",
    email: "superadmin@example.com",
    password: "SuperAdmin123!",
    role: "Super Admin",
    profileImage: "https://via.placeholder.com/150/0000FF/FFFFFF?text=SA",
  },
  {
    name: "John Admin",
    username: "johnadmin",
    email: "john.admin@example.com",
    password: "Admin123!",
    role: "Admin",
    profileImage: "https://via.placeholder.com/150/008000/FFFFFF?text=JA",
  },
  {
    name: "Jane Manager",
    username: "janemanager",
    email: "jane.manager@example.com",
    password: "Manager123!",
    role: "Manager",
    profileImage: "https://via.placeholder.com/150/FFA500/FFFFFF?text=JM",
  },
  {
    name: "Bob User",
    username: "bobuser",
    email: "bob.user@example.com",
    password: "User123!",
    role: "User",
    profileImage: "https://via.placeholder.com/150/800080/FFFFFF?text=BU",
  },
  {
    name: "Alice Smith",
    username: "alicesmith",
    email: "alice.smith@example.com",
    password: "User123!",
    role: "User",
    profileImage: "https://via.placeholder.com/150/FF69B4/FFFFFF?text=AS",
  },
  {
    name: "Guest User",
    username: "guestuser",
    email: "guest@example.com",
    password: "Guest123!",
    role: "Guest",
    profileImage: "https://via.placeholder.com/150/808080/FFFFFF?text=GU",
    isActive: true,
  },
];

// Clear existing data
const clearDatabase = async () => {
  try {
    console.log("🧹 Clearing existing data...");
    await User.deleteMany({});
    await RolePermission.deleteMany({});
    await Permission.deleteMany({});
    await Role.deleteMany({});
    console.log("✅ Database cleared successfully");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    throw error;
  }
};

// Seed roles
const seedRoles = async () => {
  try {
    console.log("🌱 Seeding roles...");
    const roles = await Role.insertMany(rolesData);
    console.log(`✅ Created ${roles.length} roles`);
    return roles;
  } catch (error) {
    console.error("❌ Error seeding roles:", error);
    throw error;
  }
};

// Seed permissions
const seedPermissions = async () => {
  try {
    console.log("🌱 Seeding permissions...");
    const permissions = await Permission.insertMany(permissionsData);
    console.log(`✅ Created ${permissions.length} permissions`);
    return permissions;
  } catch (error) {
    console.error("❌ Error seeding permissions:", error);
    throw error;
  }
};

// Seed role-permission associations
const seedRolePermissions = async (roles, permissions) => {
  try {
    console.log("🌱 Seeding role-permission associations...");
    const rolePermissionData = [];

    for (const role of roles) {
      const permissionNames = rolePermissionMappings[role.name];
      if (permissionNames) {
        const permissionIds = permissions
          .filter(p => permissionNames.includes(p.name))
          .map(p => p._id.toString());

        // Create one document per role with all its permissions as an array
        // This matches your existing structure where permission_id is an array
        rolePermissionData.push({
          role_id: role._id.toString(),
          permission_id: permissionIds,
          created_at: new Date().toString(), // Using toString() to match your format
        });
      }
    }

    const rolePermissions = await RolePermission.insertMany(rolePermissionData);
    console.log(`✅ Created ${rolePermissions.length} role-permission associations`);
    return rolePermissions;
  } catch (error) {
    console.error("❌ Error seeding role-permissions:", error);
    throw error;
  }
};

// Seed users
const seedUsers = async (roles) => {
  try {
    console.log("🌱 Seeding users...");
    const users = [];

    for (const userData of usersData) {
      const role = roles.find(r => r.name === userData.role);
      if (role) {
        // Hash password manually since we're using insertMany
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        users.push({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          role_id: role._id,
          profileImage: userData.profileImage,
          isActive: userData.isActive !== undefined ? userData.isActive : true,
        });
      }
    }

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
};

// Display seeded data summary
const displaySummary = (roles, permissions, rolePermissions, users) => {
  console.log("\n📊 SEEDING SUMMARY");
  console.log("==================");
  console.log(`Roles: ${roles.length}`);
  console.log(`Permissions: ${permissions.length}`);
  console.log(`Role-Permission Associations: ${rolePermissions.length}`);
  console.log(`Users: ${users.length}`);
  
  console.log("\n👤 CREATED USERS:");
  console.log("================");
  users.forEach(user => {
    const role = roles.find(r => r._id.toString() === user.role_id.toString());
    console.log(`• ${user.name} (${user.username}) - ${role?.name} - ${user.email}`);
  });

  console.log("\n🔑 DEFAULT PASSWORDS:");
  console.log("====================");
  console.log("All users have been created with the following pattern:");
  usersData.forEach(user => {
    console.log(`• ${user.username}: ${user.password}`);
  });
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log("🚀 Starting database seeding...");
    
    await connectDB();
    await clearDatabase();
    
    const roles = await seedRoles();
    const permissions = await seedPermissions();
    const users = await seedUsers(roles);
    
    displaySummary(roles, permissions, users);
    
    console.log("\n🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await mongoose.connection.close();
    console.log("📪 Database connection closed");
    process.exit(0);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };