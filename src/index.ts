import express from "express";
import { S3 } from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const r2Endpoint = process.env.R2_ENDPOINT;

const s3 = new S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    endpoint:r2Endpoint
})

const app = express();

app.get("/*", async (req, res) => {
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: "vercel",
        Key: `dist/${id}${filePath}`
    }).promise();
    console.log(contents)
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);
    console.log(type)

    res.send(contents.Body);
})

app.listen(3001);