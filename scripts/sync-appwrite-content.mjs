import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Client, Databases, Query, Storage } from "appwrite";

const endpoint =
  process.env.APPWRITE_ENDPOINT ?? "https://fra.cloud.appwrite.io/v1";
const projectId =
  process.env.APPWRITE_PROJECT_ID ?? "69b30650001b6b60508c";
const databaseId =
  process.env.APPWRITE_DATABASE_ID ?? "69c02ef9002fc00e846e";
const collectionId = process.env.APPWRITE_COLLECTION_ID ?? "projects";
const bucketId =
  process.env.APPWRITE_BUCKET_ID ?? "69c0335100163e29db54";

const workspaceRoot = process.cwd();
const contentDirectory = path.join(workspaceRoot, "src", "content");
const publicDirectory = path.join(workspaceRoot, "public");

const client = new Client().setEndpoint(endpoint).setProject(projectId);
const databases = new Databases(client);
const storage = new Storage(client);

function safeFileName(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function publicPathForFile(file) {
  const directory = file.mimeType.startsWith("image/")
    ? "media/images"
    : "media/documents";
  const fileName = `${file.$id}-${safeFileName(file.name)}`;

  return `/${directory}/${fileName}`;
}

function rewriteAppwriteUrls(value, assetPaths) {
  if (typeof value === "string") {
    const match = value.match(
      /fra\.cloud\.appwrite\.io\/v1\/storage\/buckets\/[^/]+\/files\/([^/]+)\//,
    );

    return match && assetPaths.has(match[1])
      ? assetPaths.get(match[1])
      : value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => rewriteAppwriteUrls(item, assetPaths));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        rewriteAppwriteUrls(item, assetPaths),
      ]),
    );
  }

  return value;
}

async function downloadFile(file, publicPath) {
  const targetPath = path.join(publicDirectory, publicPath);
  const downloadUrl = new URL(
    `${endpoint}/storage/buckets/${bucketId}/files/${file.$id}/download`,
  );
  downloadUrl.searchParams.set("project", projectId);

  const response = await fetch(downloadUrl, {
    headers: {
      "X-Appwrite-Project": projectId,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Nie udało się pobrać ${file.name}: ${response.status} ${response.statusText}`,
    );
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, Buffer.from(await response.arrayBuffer()));
}

async function main() {
  const [fileResponse, documentResponse] = await Promise.all([
    storage.listFiles(bucketId, [Query.limit(100)]),
    databases.listDocuments(databaseId, collectionId, [Query.limit(100)]),
  ]);

  const assetPaths = new Map(
    fileResponse.files.map((file) => [file.$id, publicPathForFile(file)]),
  );

  await Promise.all(
    fileResponse.files.map((file) =>
      downloadFile(file, assetPaths.get(file.$id)),
    ),
  );

  const projects = documentResponse.documents.map((document) => ({
    id: document.$id,
    projectTitle: document.projectTitle,
    projectSlug: document.projectSlug,
    blocks: rewriteAppwriteUrls(
      JSON.parse(document.contentBlocks || "[]"),
      assetPaths,
    ),
  }));

  const assets = fileResponse.files.map((file) => ({
    id: file.$id,
    name: file.name,
    mimeType: file.mimeType,
    size: file.sizeOriginal,
    publicPath: assetPaths.get(file.$id),
  }));

  await mkdir(contentDirectory, { recursive: true });
  await Promise.all([
    writeFile(
      path.join(contentDirectory, "projects.json"),
      `${JSON.stringify(projects, null, 2)}\n`,
    ),
    writeFile(
      path.join(contentDirectory, "assets.json"),
      `${JSON.stringify(assets, null, 2)}\n`,
    ),
  ]);

  console.log(
    `Zapisano ${projects.length} projektów i ${assets.length} plików w public/media.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
