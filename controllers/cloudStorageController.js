const { Storage } = require('@google-cloud/storage');
const projectId = process.env.CLOUD_PROJECT_ID
const keyFilename = './google-storage-auth.json';

//from here: https://cloud.google.com/storage/docs/samples/storage-generate-signed-url-v4
// Creates a client  
const storage = new Storage({ projectId, keyFilename });

module.exports.generateV4ReadSignedUrl = async (req, res, next) => {
  const { body, body: { bucketName, fileName }, session } = req;

  // These options will allow temporary read access to the file
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  // Get a v4 signed URL for reading the file
  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options);
  res.status(200).send({
    status: "success",
    signedUrl: url
  })
}
