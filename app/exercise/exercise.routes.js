import express from 'express';
import {
	createNewExercise,
	deleteExercise,
	getExercises,
	updateExercise
} from './exercise.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
	createNewExerciseLog,
	getExerciseLog,
	updateCompleteExerciseLog,
	updateExerciseLogTime
} from './log/exercise-log.controller.js';

const router = express.Router();
router.route(`/`).post(protect, createNewExercise).get(protect, getExercises);
router
	.route(`/:id`)
	.delete(protect, deleteExercise)
	.put(protect, updateExercise);

router
	.route('/log/:id')
	.get(protect, getExerciseLog)
	.post(protect, createNewExerciseLog);

router.route('/log/time/:id').put(protect, updateExerciseLogTime);
router.route('/log/complete/:id').patch(protect, updateCompleteExerciseLog);

export default router;
