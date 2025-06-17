const multer = require("multer");

const storage = multer.memoryStorage(); // for RAM
const upload = multer({ storage });

module.exports = upload;
