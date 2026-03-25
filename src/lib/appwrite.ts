import { Client, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("69b30650001b6b60508c");

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
