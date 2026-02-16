const axios = require("axios");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "pathumlakshanherath";
const REPO_NAME = "quickeats";
const BRANCH = "main";

exports.upload = async function uploadFile(file) {
  const fileName = file.originalname;
  const storagePath = `food/${Date.now()}_${fileName}`;
  const fileContent = file.buffer.toString("base64");

  await axios.put(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${storagePath}`,
    {
      message: `Upload ${storagePath}`,
      content: fileContent,
    },
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${storagePath}`;
};
