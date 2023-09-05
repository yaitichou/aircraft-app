/** source/routes/posts.ts */
import express from 'express';
import controller from '../controllers/detection';
const router = express.Router();


// Redirect API path to the adequate controller
router.post('/detection', controller.detectionRequest);

export = router;