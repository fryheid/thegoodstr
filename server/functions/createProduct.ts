import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { customAlphabet } from "nanoid";

type Product = {
  name: string;
  description: string;
  imageS3Key: string;
  price: number;
};

const nanoid = customAlphabet("1234567890abdef", 10);

const s3Client = new S3Client({});

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!process.env.BUCKET) {
    console.error("BUCKET env var is not set");
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: "BUCKET env var is not set",
    };
  }

  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL env var is not set");
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: "MONGO_URL env var is not set",
    };
  }

  const mongoClient = new MongoClient(process.env.MONGO_URL || "");

  if (!event.body) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: "Missing request body",
    };
  }

  const { name, description, coverImage, price } = JSON.parse(event.body);

  if (!name || !description || !coverImage || !price) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: "Missing required fields",
    };
  }

  const newProduct: Product = {
    name,
    description,
    imageS3Key: "img_" + nanoid(),
    price,
  };

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET,
    Key: newProduct.imageS3Key,
    Body: coverImage,
  });

  try {
    await s3Client.send(command);

    await mongoClient.connect();
    const db = mongoClient.db("thegoodstr");
    const productsCollection = db.collection<Product>("products");
    await productsCollection.insertOne(newProduct);

    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: "Success!",
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: "Failed to create product. Check logs.",
    };
  }
};
