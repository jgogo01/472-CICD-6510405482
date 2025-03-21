import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data/members.json");

const createResponse = (status: number, message: string | null, data: any) => ({
  status,
  message,
  data,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json(createResponse(400, "Invalid ID", null));
  }

  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    if (!fileData) {
      return res.status(404).json(createResponse(404, "Data not found", null));
    }
    const students = JSON.parse(fileData);

    if (req.method === "GET") {
      const studentExists = students.some(
        (student: { id: string }) => student.id === String(id)
      );

      if (!studentExists) {
        return res.status(404).json(createResponse(404, "Student not found", null));
      }

      const filteredStudents = students.filter(
        (student: { id: string }) => student.id !== String(id)
      );

      return res.status(200).json(createResponse(200, null, filteredStudents));
    }

    return res
      .status(405)
      .json(createResponse(405, "Method Not Allowed", null));
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json(createResponse(500, "Server Error", null));
  }
}
