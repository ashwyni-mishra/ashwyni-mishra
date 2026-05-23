// Override environment variables before any other imports
process.env.JWT_SECRET = "fallback-secret-key-at-least-32-chars-long";
process.env.NEXTAUTH_SECRET = "fallback-secret-key-at-least-32-chars-long";
process.env.NODE_ENV = "test";

import assert from "node:assert";
import { NextRequest } from "next/server";
import { generateToken } from "@/lib/auth";
import { POST, GET } from "@/app/api/repositories/route";
import { GET as GET_ID, DELETE as DELETE_ID } from "@/app/api/repositories/[id]/route";

// Global Mock State to easily manipulate database response states for test assertions
const mockState = {
  userExists: true,
  repoExists: true,
  createdRepo: null as any,
  deletedCount: 0,
};

// Define and register the global Prisma mock before lazy loading happens in the routes
const mockPrisma = {
  user: {
    findUnique: async (args: any) => {
      if (mockState.userExists) {
        return { id: args.where.id, email: "test@example.com", name: "Test User" };
      }
      return null;
    },
  },
  repository: {
    create: async (args: any) => {
      const repo = {
        id: 123,
        name: args.data.name,
        url: args.data.url,
        description: args.data.description || null,
        userId: args.data.userId,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockState.createdRepo = repo;
      return repo;
    },
    findFirst: async (args: any) => {
      // Create endpoint checks for existing URL for this user:
      // where: { url, userId }
      if (args.where.url && args.where.userId) {
        if (mockState.repoExists && mockState.createdRepo && mockState.createdRepo.url === args.where.url) {
          return mockState.createdRepo;
        }
        return null;
      }
      // ID fetch checks for: where: { id, userId }
      if (args.where.id && args.where.userId) {
        if (mockState.repoExists) {
          return {
            id: args.where.id,
            name: "test-repo",
            url: "https://github.com/test-owner/test-repo",
            description: "test description",
            userId: args.where.userId,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
        return null;
      }
      return null;
    },
    findUnique: async (args: any) => {
      if (mockState.repoExists && args.where.id === 123) {
        return {
          id: 123,
          name: "test-repo",
          url: "https://github.com/test-owner/test-repo",
          description: "test description",
          userId: 999,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      return null;
    },
    findMany: async (args: any) => {
      if (mockState.repoExists && args.where.userId === 999) {
        return [
          {
            id: 123,
            name: "test-repo",
            url: "https://github.com/test-owner/test-repo",
            description: "test description",
            userId: 999,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
            languages: [],
          },
        ];
      }
      return [];
    },
    delete: async (args: any) => {
      if (mockState.repoExists && args.where.id === 123) {
        mockState.deletedCount++;
        return { id: 123 };
      }
      throw new Error("Repository not found");
    },
    update: async (args: any) => {
      return { id: args.where.id };
    },
  },
  analysisJob: {
    create: async (args: any) => {
      return {
        id: "job-uuid-111",
        repositoryId: args.data.repositoryId,
        userId: args.data.userId,
        status: "QUEUED",
        attempts: 0,
        maxAttempts: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
    findFirst: async (args: any) => {
      if (args.where.repositoryId === 123 && args.where.userId === 999) {
        return {
          id: "job-uuid-111",
          status: "QUEUED",
          type: "repository_analysis",
          attempts: 0,
          maxAttempts: 3,
          nextRunAt: new Date(),
          progressPercent: 0,
          progressMessage: "Queued",
          startedAt: null,
          finishedAt: null,
          error: null,
          updatedAt: new Date(),
          createdAt: new Date(),
        };
      }
      return null;
    },
  },
};

(globalThis as any).prisma = mockPrisma;

let failed = false;

async function test(name: string, fn: () => Promise<void>) {
  try {
    // Reset mock state before each test
    mockState.userExists = true;
    mockState.repoExists = true;
    mockState.createdRepo = null;
    mockState.deletedCount = 0;

    await fn();
    console.log(`\x1b[32m✓\x1b[0m ${name}`);
  } catch (err: any) {
    console.error(`\x1b[31m✗\x1b[0m ${name}`);
    console.error(err);
    failed = true;
  }
}

async function runTests() {
  console.log("=== Running Repository CRUD API Integration Tests ===\n");

  const validToken = generateToken({ userId: 999, email: "test@example.com" });

  // --- Authorization & Authentication Checks ---

  await test("GET /api/repositories - Fail when token is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/repositories", {
      method: "GET",
    });
    const res = await GET(req);
    assert.strictEqual(res.status, 401);
    const json = await res.json();
    assert.strictEqual(json.error, "Unauthorized");
  });

  await test("GET /api/repositories - Fail when token is invalid", async () => {
    const req = new NextRequest("http://localhost:3000/api/repositories", {
      method: "GET",
      headers: { Authorization: "Bearer invalid-token-string" },
    });
    const res = await GET(req);
    assert.strictEqual(res.status, 401);
  });

  await test("GET /api/repositories - Fail when user does not exist in DB (deleted user)", async () => {
    mockState.userExists = false;
    const req = new NextRequest("http://localhost:3000/api/repositories", {
      method: "GET",
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const res = await GET(req);
    assert.strictEqual(res.status, 401);
  });

  // --- Create Repository (POST /api/repositories) ---

  await test("POST /api/repositories - Fail when name is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/repositories", {
      method: "POST",
      headers: { Authorization: `Bearer ${validToken}` },
      body: JSON.stringify({
        url: "https://github.com/owner/repo",
      }),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.error, "Name and URL are required");
  });

  await test("POST /api/repositories - Fail when url is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/repositories", {
      method: "POST",
      headers: { Authorization: `Bearer ${validToken}` },
      body: JSON.stringify({
        name: "my-repo",
      }),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 400);
  });

  await test("POST /api/repositories - Fail when url format is invalid", async () => {
    const req = new NextRequest("http://localhost:3000/api/repositories", {
      method: "POST",
      headers: { Authorization: `Bearer ${validToken}` },
      body: JSON.stringify({
        name: "my-repo",
        url: "invalid-url-format",
      }),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.ok(json.error.includes("Invalid repository URL"));
  });

  await test("POST /api/repositories - Success path", async () => {
    mockState.repoExists = false;
    const req = new NextRequest("http://localhost:3000/api/repositories", {
      method: "POST",
      headers: { Authorization: `Bearer ${validToken}` },
      body: JSON.stringify({
        name: "my-repo",
        url: "https://github.com/owner/repo",
        description: "my description",
      }),
    });
    const res = await POST(req);
    assert.strictEqual(res.status, 201);
    const json = await res.json();

    assert.strictEqual(json.repository.id, 123);
    assert.strictEqual(json.repository.name, "my-repo");
    assert.strictEqual(json.repository.url, "https://github.com/owner/repo");
    assert.strictEqual(json.repository.userId, 999);
    assert.strictEqual(json.jobId, "job-uuid-111");
    assert.strictEqual(json.jobStatus, "QUEUED");
  });

  // --- List Repositories (GET /api/repositories) ---

  await test("GET /api/repositories - Success path", async () => {
    const req = new NextRequest("http://localhost:3000/api/repositories", {
      method: "GET",
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const res = await GET(req);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.ok(Array.isArray(json.repositories));
    assert.strictEqual(json.repositories.length, 1);
    assert.strictEqual(json.repositories[0].name, "test-repo");
  });

  // --- Fetch Repository Details (GET /api/repositories/[id]) ---

  await test("GET /api/repositories/[id] - Success path", async () => {
    const req = new NextRequest("http://localhost:3000/api/repositories/123", {
      method: "GET",
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const res = await GET_ID(req, { params: { id: "123" } });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.repository.id, 123);
    assert.strictEqual(json.repository.name, "test-repo");
    assert.strictEqual(json.latestJob.id, "job-uuid-111");

    // Secure headers verification
    assert.strictEqual(res.headers.get("Cache-Control"), "no-store, no-cache, must-revalidate, proxy-revalidate");
    assert.strictEqual(res.headers.get("Pragma"), "no-cache");
    assert.strictEqual(res.headers.get("Expires"), "0");
  });

  await test("GET /api/repositories/[id] - Fail when ID is not an integer", async () => {
    const req = new NextRequest("http://localhost:3000/api/repositories/abc", {
      method: "GET",
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const res = await GET_ID(req, { params: { id: "abc" } });
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.error, "Invalid repository ID");
    assert.strictEqual(res.headers.get("Cache-Control"), "no-store, no-cache, must-revalidate, proxy-revalidate");
  });

  await test("GET /api/repositories/[id] - Fail when repository is not found", async () => {
    mockState.repoExists = false;
    const req = new NextRequest("http://localhost:3000/api/repositories/456", {
      method: "GET",
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const res = await GET_ID(req, { params: { id: "456" } });
    assert.strictEqual(res.status, 404);
    const json = await res.json();
    assert.strictEqual(json.error, "Repository not found");
  });

  // --- Delete Repository (DELETE /api/repositories/[id]) ---

  await test("DELETE /api/repositories/[id] - Success path", async () => {
    const req = new NextRequest("http://localhost:3000/api/repositories/123", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const res = await DELETE_ID(req, { params: { id: "123" } });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.message, "Repository deleted successfully");
    assert.strictEqual(mockState.deletedCount, 1);

    // Secure headers verification
    assert.strictEqual(res.headers.get("Cache-Control"), "no-store, no-cache, must-revalidate, proxy-revalidate");
  });

  await test("DELETE /api/repositories/[id] - Fail when ID is not an integer", async () => {
    const req = new NextRequest("http://localhost:3000/api/repositories/abc", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const res = await DELETE_ID(req, { params: { id: "abc" } });
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.error, "Invalid repository ID");
  });

  await test("DELETE /api/repositories/[id] - Fail when repository is not found", async () => {
    mockState.repoExists = false;
    const req = new NextRequest("http://localhost:3000/api/repositories/456", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const res = await DELETE_ID(req, { params: { id: "456" } });
    assert.strictEqual(res.status, 404);
    const json = await res.json();
    assert.strictEqual(json.error, "Repository not found");
  });

  console.log("\n-------------------------------------------");
  if (failed) {
    console.error("\x1b[31mSome integration tests failed.\x1b[0m");
    process.exit(1);
  } else {
    console.log("\x1b[32mAll integration tests passed successfully!\x1b[0m");
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
