import express from 'express';
import { getSongs, addSong, deleteSong } from '../controllers/song';

const router = express.Router();

router.get('/', getSongs);
router.post('/', addSong);
router.delete('/:id', deleteSong);

export default router;
