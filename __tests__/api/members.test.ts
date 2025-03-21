import { createMocks } from "node-mocks-http";
import getMembers from "../../src/pages/api/member/[id]";
import getMemberById from "../../src/pages/api/member/exclude/[id]";
import fs from "fs/promises";
import path from "path";
import MemberInterface from "../../src/interface/MemberInterface";

describe("Members API", () => {
  let members: MemberInterface[];
  beforeAll(async () => {
    try {
      const filePath = path.join(process.cwd(), "data", "members.json");
      const data = await fs.readFile(filePath, "utf-8");
      members = JSON.parse(data) as MemberInterface[];
      if (!Array.isArray(members)) {
        throw new Error("Invalid data format");
      }
      if (
        members.some(
          (s) => typeof s.id !== "string" || typeof s.name !== "string"
        )
      ) {
        throw new Error("Invalid data format");
      }
      if (members.length < 2) {
        throw new Error("Not enough members to run tests");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error reading data: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  });

  beforeEach(() => {
    if (members.length < 2) {
      fail("Not enough data for the test");
    }
    jest.resetAllMocks();
    jest.spyOn(fs, "readFile").mockResolvedValue(JSON.stringify(members));
  });

  describe("GET /api/member/exclude/[id] endpoint", () => {
    test("should return filtered students list without specified ID", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { id: members[0].id },
      });

      await getMemberById(req, res);

      expect(res._getStatusCode()).toBe(200);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(200);
      expect(responseData.message).toBeNull();
      expect(responseData.data).toHaveLength(members.length - 1);
      expect(
        responseData.data.find((s: MemberInterface) => s.id === members[0].id)
      ).toBeUndefined();
    });

    test("should return 400 when ID is invalid", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { id: "invalid" },
      });

      await getMemberById(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(400);
      expect(responseData.message).toBe("Invalid ID");
      expect(responseData.data).toBeNull();
    });

    test("should return 400 when ID is missing", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {},
      });

      await getMemberById(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(400);
      expect(responseData.message).toBe("Invalid ID");
      expect(responseData.data).toBeNull();
    });

    test("should return 405 for non-GET methods", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: { id: "6510405482" },
      });

      await getMemberById(req, res);

      expect(res._getStatusCode()).toBe(405);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(405);
      expect(responseData.message).toBe("Method Not Allowed");
      expect(responseData.data).toBeNull();
    });
  });

  describe("GET /api/member/[id] endpoint", () => {
    test("should return a specific student by ID", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { id: members[1].id },
      });

      await getMembers(req, res);

      expect(res._getStatusCode()).toBe(200);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(200);
      expect(responseData.message).toBeNull();
      expect(responseData.data).toEqual({
        id: members[1].id,
        name: members[1].name,
      });
    });

    test("should return 404 when student is not found", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { id: "999" },
      });

      await getMembers(req, res);

      expect(res._getStatusCode()).toBe(404);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(404);
      expect(responseData.message).toBe("Student not found");
      expect(responseData.data).toBeNull();
    });

    test("should return 400 when ID is invalid", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { id: "invalid" },
      });

      await getMembers(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(400);
      expect(responseData.message).toBe("Invalid ID");
      expect(responseData.data).toBeNull();
    });

    test("should return 400 when ID is missing", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {},
      });

      await getMembers(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(400);
      expect(responseData.message).toBe("Invalid ID");
      expect(responseData.data).toBeNull();
    });

    test("should return 405 for non-GET methods", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: { id: "6510405814" },
      });

      await getMembers(req, res);

      expect(res._getStatusCode()).toBe(405);
      const responseData = JSON.parse(res._getData());
      expect(responseData.status).toBe(405);
      expect(responseData.message).toBe("Method Not Allowed");
      expect(responseData.data).toBeNull();
    });
  });
});
