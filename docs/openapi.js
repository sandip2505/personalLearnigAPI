module.exports = {
  openapi: "3.0.3",
  info: {
    title: "Personal Learning API",
    version: "1.0.0",
    description:
      "API documentation for users, roles, courses, lessons, quizzes, enrollments, payments, reviews, and notifications. Secured with Bearer JWT.",
  },
  servers: [{ url: "/api" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          username: { type: "string" },
          email: { type: "string", format: "email" },
          role_id: { type: "string" },
          profileImage: { type: "string" },
        },
      },
      Course: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          price: { type: "number" },
          level: {
            type: "string",
            enum: ["beginner", "intermediate", "advanced"],
          },
          thumbnail: { type: "string" },
          instructor: { type: "string" },
        },
        required: ["title", "instructor"],
      },
      Lesson: {
        type: "object",
        properties: {
          _id: { type: "string" },
          course: { type: "string" },
          title: { type: "string" },
          contentType: { type: "string" },
          contentUrl: { type: "string" },
          orderIndex: { type: "integer" },
          duration: { type: "integer" },
        },
      },
      Quiz: {
        type: "object",
        properties: {
          _id: { type: "string" },
          course: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
        },
      },
      Question: {
        type: "object",
        properties: {
          _id: { type: "string" },
          quiz: { type: "string" },
          questionText: { type: "string" },
          questionType: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          correctAnswer: { type: ["string", "number", "boolean", "array", "object", "null"] },
        },
      },
      QuizResult: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          quiz: { type: "string" },
          score: { type: "number" },
          submittedAt: { type: "string", format: "date-time" },
        },
      },
      Enrollment: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          course: { type: "string" },
          progress: { type: "number" },
        },
      },
      Payment: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          course: { type: "string" },
          amount: { type: "number" },
          paymentStatus: { type: "string" },
          transactionId: { type: "string" },
        },
      },
      Review: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          course: { type: "string" },
          rating: { type: "integer" },
          comment: { type: "string" },
        },
      },
      Notification: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string" },
          type: { type: "string" },
          title: { type: "string" },
          message: { type: "string" },
          isRead: { type: "boolean" },
        },
      },
      Category: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          parentId: { type: ["string", "null"] },
        },
      },
      Role: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
        },
      },
      Permission: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
        },
      },
      RolePermission: {
        type: "object",
        properties: {
          _id: { type: "string" },
          role_id: { type: "string" },
          permission_id: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/login": {
      post: {
        summary: "User login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { email: { type: "string" }, password: { type: "string" } },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: { 200: { description: "JWT issued" } },
      },
    },
    "/users": {
      get: { summary: "List users", responses: { 200: { description: "OK" } } },
    },
    "/createUser": {
      post: {
        summary: "Create user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
        },
        responses: { 201: { description: "Created" } },
      },
    },
    "/editUser/{id}": {
      get: {
        summary: "Get user by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" }, 404: { description: "Not found" } },
      },
    },
    "/updateUser/{id}": {
      put: {
        summary: "Update user",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
        responses: { 200: { description: "Updated" } },
      },
    },
    "/deleteUser/{id}": {
      delete: {
        summary: "Delete user",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Deleted" } },
      },
    },
    "/register": {
      post: {
        summary: "User registration",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
        },
        responses: { 201: { description: "Registered" } },
      },
    },
    "/courses": {
      get: { summary: "List courses", responses: { 200: { description: "OK" } } },
      post: {
        summary: "Create course",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Course" } } },
        },
        responses: { 201: { description: "Created" } },
      },
    },
    "/courses/{id}": {
      get: {
        summary: "Get course",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" }, 404: { description: "Not found" } },
      },
      put: {
        summary: "Update course",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Course" } } } },
        responses: { 200: { description: "Updated" } },
      },
      delete: {
        summary: "Delete course",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Deleted" } },
      },
    },
    "/courses/{courseId}/lessons": {
      get: {
        summary: "List lessons",
        parameters: [{ name: "courseId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" } },
      },
      post: {
        summary: "Create lesson",
        parameters: [{ name: "courseId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Lesson" } } } },
        responses: { 201: { description: "Created" } },
      },
    },
    "/lessons/{id}": {
      put: {
        summary: "Update lesson",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Lesson" } } } },
        responses: { 200: { description: "Updated" } },
      },
      delete: {
        summary: "Delete lesson",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Deleted" } },
      },
    },
    "/quizzes": {
      get: { summary: "List quizzes", responses: { 200: { description: "OK" } } },
      post: {
        summary: "Create quiz",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Quiz" } } } },
        responses: { 201: { description: "Created" } },
      },
    },
    "/quizzes/{id}": {
      get: {
        summary: "Get quiz",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" } },
      },
    },
    "/quizzes/{quizId}/questions": {
      get: {
        summary: "List questions",
        parameters: [{ name: "quizId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" } },
      },
      post: {
        summary: "Create question",
        parameters: [{ name: "quizId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Question" } } } },
        responses: { 201: { description: "Created" } },
      },
    },
    "/questions/{id}": {
      put: {
        summary: "Update question",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Updated" } },
      },
      delete: {
        summary: "Delete question",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Deleted" } },
      },
    },
    "/quizzes/{quizId}/submit": {
      post: {
        summary: "Submit quiz result",
        parameters: [{ name: "quizId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 201: { description: "Recorded" } },
      },
    },
    "/quizzes/{quizId}/results": {
      get: {
        summary: "Quiz results",
        parameters: [{ name: "quizId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" } },
      },
    },
    "/enrollments": {
      post: {
        summary: "Enroll user",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Enrollment" } } } },
        responses: { 201: { description: "Created" } },
      },
    },
    "/courses/{courseId}/enrollments": {
      get: {
        summary: "List enrollments by course",
        parameters: [{ name: "courseId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" } },
      },
    },
    "/users/{userId}/enrollments": {
      get: {
        summary: "List enrollments by user",
        parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" } },
      },
    },
    "/payments": {
      post: {
        summary: "Create payment",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Payment" } } } },
        responses: { 201: { description: "Created" } },
      },
    },
    "/courses/{courseId}/payments": {
      get: {
        summary: "Payments by course",
        parameters: [{ name: "courseId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" } },
      },
    },
    "/users/{userId}/payments": {
      get: {
        summary: "Payments by user",
        parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" } },
      },
    },
    "/courses/{courseId}/reviews": {
      get: {
        summary: "List reviews",
        parameters: [{ name: "courseId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" } },
      },
      post: {
        summary: "Create review",
        parameters: [{ name: "courseId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Review" } } } },
        responses: { 201: { description: "Created" } },
      },
    },
    "/reviews/{id}": {
      delete: {
        summary: "Delete review",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Deleted" } },
      },
    },
    "/notifications": {
      post: {
        summary: "Create notification",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Notification" } } } },
        responses: { 201: { description: "Created" } },
      },
    },
    "/users/{userId}/notifications": {
      get: {
        summary: "List notifications for user",
        parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" } },
      },
    },
    "/notifications/{id}/read": {
      put: {
        summary: "Mark notification read",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" } },
      },
    },
    
    
    // Categories (content)
    "/createCategory": {
      post: {
        summary: "Create category",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Category" } } } },
        responses: { 201: { description: "Created" } },
      },
    },
    "/categories": {
      get: { summary: "List categories", responses: { 200: { description: "OK" } } },
    },
    "/category/{id}": {
      get: { summary: "Get category", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } },
    },
    "/updateCategory/{id}": {
      put: {
        summary: "Update category",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Category" } } } },
        responses: { 200: { description: "Updated" } },
      },
    },
    "/deleteCategory/{id}": {
      delete: { summary: "Delete category", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Deleted" } } },
    },

    // Roles
    "/roles": { get: { summary: "List roles", responses: { 200: { description: "OK" } } } },
    "/createRole": {
      post: { summary: "Create role", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Role" } } } }, responses: { 201: { description: "Created" } } },
    },
    "/editRole/{id}": { get: { summary: "Get role", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
    "/updateRole/{id}": { put: { summary: "Update role", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Role" } } } }, responses: { 200: { description: "Updated" } } } },
    "/deleteRole/{id}": { delete: { summary: "Delete role", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Deleted" } } } },
    "/rolePermissions/{id}": { get: { summary: "Get permissions by role id", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },

    // Permissions
    "/permissions": { get: { summary: "List permissions", responses: { 200: { description: "OK" } } } },
    "/createPermission": { post: { summary: "Create permission", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Permission" } } } }, responses: { 201: { description: "Created" } } } },
    "/editPermission/{id}": { get: { summary: "Get permission", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
    "/updatePermission/{id}": { put: { summary: "Update permission", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Permission" } } } }, responses: { 200: { description: "Updated" } } } },
    "/deletePermission/{id}": { delete: { summary: "Delete permission", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Deleted" } } } },

    // Role-Permission documents
    "/rolePermissions": { get: { summary: "List role-permission docs", responses: { 200: { description: "OK" } } } },
    "/createRolePermission": { post: { summary: "Create or update role-permission", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RolePermission" } } } }, responses: { 201: { description: "Created/Updated" } } } },
    "/editRolePermission/{id}": { get: { summary: "Get role-permission", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
    "/updateRolePermission/{id}": { put: { summary: "Update role-permission", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/RolePermission" } } } }, responses: { 200: { description: "Updated" } } } },
    "/deleteRolePermission/{id}": { delete: { summary: "Delete role-permission", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Deleted" } } } },
    "/findbyrole/{id}": { get: { summary: "Find role-permission by role id", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
  },
};


