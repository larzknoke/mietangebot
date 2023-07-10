import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import formidable from "formidable";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import { s3 } from "../../../lib/s3";

export const config = {
  api: { bodyParser: false },
};

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  console.log("session", session);
  if (!session) {
    return res.status(401).json({ error: "401 not authenticated" });
  }

  if (req.method == "POST") {
    const form = formidable({
      uploadDir: "./.tmp",
      keepExtensions: true,
      multiples: false,
      maxFileSize: 500 * 1024 * 1024,
    });
    form.on("error", (err) => {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Datei ist ungültig." });
    });

    form.parse(req, async (err, fields, files) => {
      try {
        const fileFolder = uuidv4();

        const file = files.mietvertrag[0];
        console.log("file: ", file);

        const key =
          fileFolder +
          "/" +
          Date.now().toString() +
          "-" +
          file.originalFilename;

        const fileParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Body: fs.readFileSync(file.filepath),
          ContentType: file.mimetype,
          ACL: "public-read",
        };

        console.log("fileParams: ", fileParams);

        const fileUpload = await s3.send(new PutObjectCommand(fileParams));

        const result = await prisma.miet.create({
          data: {
            strasse: fields["strasse"][0],
            hausnummer: fields["hausnummer"][0],
            plz: fields["plz"][0],
            ort: fields["ort"][0],
            baujahr: parseFloat(fields["baujahr"][0]),
            groesse: parseInt(fields["groesse"][0]),
            nettokalt: parseFloat(fields["nettokalt"][0]),
            mietvertrag: key,
          },
        });
        return res.status(200).json(result);
      } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({ error: error.message, code: error.code });
      }
    });
  }
}
