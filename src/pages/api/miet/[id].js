import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";

// POST /api/post
export default async function handle(req, res) {
  const { id } = req.query;

  console.log("id: ", id);

  if (req.method == "DELETE") {
    const session = await getServerSession(req, res, authOptions);
    console.log("session", session);
    if (!session) {
      return res.status(401).json({ error: "401 not authenticated" });
    }
    try {
      const result = await prisma.miet.delete({ where: { id: parseInt(id) } });
      return res.status(200).json(result);
    } catch (error) {
      console.log("error: ", error);
      return res.status(500).json({ error: error.message, code: error.code });
    }
  }
}
