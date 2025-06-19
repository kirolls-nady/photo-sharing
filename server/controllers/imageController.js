const Image = require('../models/Image');
const upload = require('../middleware/upload');

exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find().populate('user', 'name').sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'فشل في جلب الصور', error: err.message });
  }
};

exports.uploadImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const imageUrl = '/uploads/' + req.file.filename;

      const image = new Image({
        title,
        description,
        imageUrl,
        user: req.user.id,
        likes: []
      });

      await image.save();
      res.status(201).json(image);
    } catch (err) {
      res.status(500).json({ message: 'فشل في رفع الصورة', error: err.message });
    }
  }
];

exports.updateImage = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = await Image.findById(req.params.id);

    if (!image) return res.status(404).json({ message: 'الصورة غير موجودة' });
    if (image.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'غير مصرح لك بهذا الإجراء' });
    }

    image.title = title;
    image.description = description;
    await image.save();

    res.json(image);
  } catch (err) {
    res.status(500).json({ message: 'فشل في تحديث الصورة', error: err.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) return res.status(404).json({ message: 'الصورة غير موجودة' });
    if (image.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'غير مصرح لك بهذا الإجراء' });
    }

    await image.deleteOne();
    res.json({ message: 'تم حذف الصورة بنجاح' });
  } catch (err) {
    res.status(500).json({ message: 'فشل في حذف الصورة', error: err.message });
  }
};

exports.likeImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'الصورة غير موجودة' });

    const alreadyLiked = image.likes.some(like => like.toString() === req.user.id);
    
    if (alreadyLiked) {
      image.likes = image.likes.filter(like => like.toString() !== req.user.id);
    } else {
      image.likes.push(req.user.id);
    }

    await image.save();
    res.json(image);
  } catch (err) {
    res.status(500).json({ message: 'فشل في تسجيل الإعجاب', error: err.message });
  }
};