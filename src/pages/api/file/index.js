import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../../lib/s3";

export default async function handle(req, res) {
  const { key } = req.query;

  if (req.method == "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "401 not authenticated" });
    }
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return res.status(200).json(url);
    } catch (error) {
      return res.status(500).json({ error: error.message, code: error.code });
    }
  }
}
