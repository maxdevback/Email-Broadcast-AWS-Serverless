const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const AWS = require("aws-sdk");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const s3 = new AWS.S3();
const express = require("express");
const serverless = require("serverless-http");
const { v4 } = require("uuid");
const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);
const { transporter } = require("./nodemailer");
const { serverError, createEmailHTML, getQuote, getSubs } = require("./utils");

app.use(express.json());
//Work
app.get("/quotes", (req, res) => {
  try {
    s3.getObject(
      {
        Bucket: process.env.BUCKET_LINK,
        Key: "quotes.json",
      },
      (err, data) => {
        if (err) throw err;
        const json = JSON.parse(data.Body);
        res.status(200).json(json);
      }
    );
  } catch (err) {
    serverError(res, err);
  }
});
//Work
//body: {email}
app.post("/subscribe", (req, res) => {
  const currentTime = new Date().getTime();
  try {
    const params = {
      TableName: USERS_TABLE,
      Item: {
        userId: v4(),
        email: req.body.email,
        createdAt: currentTime,
        updatedAt: currentTime,
      },
    };
    dynamoDbClient.send(new PutCommand(params));
    res.status(200).json(params.Item);
  } catch (err) {
    serverError(res, err);
  }
});
//Work
app.post("/sendEmail", async (req, res) => {
  try {
    const subs = await getSubs();
    await transporter.sendMail({
      to: subs,
      from: process.env.EMAIL_LOGIN,
      text: "Get Inspired Today",
      html: createEmailHTML(await getQuote()),
    });
    res.status(200).json({ message: "ok" });
  } catch (err) {
    serverError(res, err);
  }
});
//Work
app.get("/getSubscribers", async (req, res) => {
  try {
    const params = {
      TableName: USERS_TABLE,
    };
    const command = await new ScanCommand(params);
    const data = await client.send(command);
    res.status(200).json(data.Items);
  } catch (err) {
    serverError(res, err);
  }
});
//Work
app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
