import asyncHandler from 'express-async-handler';
import { prisma } from '../prisma.js';

// @desc Create exercise
// @route POST /api/exercises
// @access Private
export const createNewExercise = asyncHandler(async (req, res) => {
	const { name, times, image } = req.body;

	const exercise = await prisma.exercise.create({
		data: {
			name,
			times,
			image
		}
	});

	res.json(exercise);
});

// @desc Get exercise
// @route GET /api/exercises
// @access Private
export const getExercises = asyncHandler(async (req, res) => {
	const exercises = await prisma.exercise.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	});
	res.json(exercises);
});

// @desc Delete exercise
// @route DELETE /api/exercises/:id
// @access Private
export const deleteExercise = asyncHandler(async (req, res) => {
	try {
		await prisma.exercise.delete({
			where: {
				id: +req.params.id
			}
		});

		res.json({ message: 'Exercise delete!' });
	} catch (error) {
		res.status(404);
		throw new Error('Exercise not found!');
	}
});

// @desc Update exercise
// @route PUT /api/exercises/:id
// @access Private
export const updateExercise = asyncHandler(async (req, res) => {
	const { name, times, image } = req.body;

	try {
		const updatedExercise = await prisma.exercise.update({
			data: {
				name,
				times,
				image
			},
			where: {
				id: +req.params.id
			}
		});

		res.json(updatedExercise);
	} catch (error) {
		res.status(404);
		throw new Error('Exercise not found!');
	}
});
