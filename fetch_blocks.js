import { Client, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("69b30650001b6b60508c");

const databases = new Databases(client);

async function run() {
  const response = await databases.listDocuments(
    "69c02ef9002fc00e846e",
    "projects"
  );
  
  if (response.documents.length > 0) {
    const blocks = JSON.parse(response.documents[0].contentBlocks || "[]");
    console.log(JSON.stringify(blocks, null, 2));
  }
}

run();
