import { Router, Request, Response } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { uploadImage, deleteImage } from '../lib/cloudinary.js';

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG images are allowed'));
    }
  },
});

router.post(
  '/image',
  requireAuth,
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const result = await uploadImage(req.file.buffer, req.user!.userId);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to upload image' });
      }
    }
  }
);

router.delete(
  '/image/:publicId',
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const publicId = typeof req.params.publicId === 'string' 
        ? decodeURIComponent(req.params.publicId)
        : decodeURIComponent(req.params.publicId[0]);
      await deleteImage(publicId);
      res.json({ message: 'Image deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete image' });
      }
    }
  }
);

export default router;
