const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const imageController = require('../controllers/imageController');

router.get('/', imageController.getAllImages);
router.post('/', auth, imageController.uploadImage);
router.put('/:id', auth, imageController.updateImage);
router.delete('/:id', auth, imageController.deleteImage);
router.post('/:id/like', auth, imageController.likeImage);

module.exports = router;