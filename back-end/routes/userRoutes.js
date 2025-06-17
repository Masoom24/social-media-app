const express = require("express");
const {
  toggleFollow,
  getCelebrities,
} = require("../controllers/userController");
const router = express.Router();

router.post("/follow", toggleFollow);
router.get("/celebrities", getCelebrities);

module.exports = router;
