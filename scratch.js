import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Adjust if needed
    .setProject('66df55cd003b5f36e8e0'); // Wait, what is the project ID? 
// Actually, I can just grep the Next.js project to find the projectId!
