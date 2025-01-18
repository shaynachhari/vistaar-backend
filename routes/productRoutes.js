const express = require("express");
const {getAllProducts,createProduct,updateProduct,deleteProduct,} = require("../controllers/productController");
const { verifyToken }= require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/imageUpload");

const router = express.Router();

router.get("/", verifyToken,getAllProducts);
  
router.post("/", verifyToken, checkRole("admin"),upload.single("image"), createProduct);
router.put("/:id", verifyToken, checkRole("admin"),upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, checkRole("admin"), deleteProduct);

module.exports = router;
