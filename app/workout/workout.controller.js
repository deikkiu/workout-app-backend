import asyncHandler from 'express-async-handler';
import { prisma } from '../prisma.js';
import { calculateMinutes } from './calculate-minutes.utils.js';

// @desc Get workout by id
// @route GET /api/workout/:id
// @access Private
export const getWorkout = asyncHandler(async (req, res) => {
	const workout = await prisma.workout.findUnique({
		where: { id: +req.params.id },
		include: {
			exercises: true
		}
	});

	if (!workout) {
		res.status(404);
		throw new Error('Workout not found!');
	}

	const minutes = calculateMinutes(workout.exercises.length);

	res.json({ ...workout, minutes });
});

// @desc Get all workouts
// @route GET /api/workouts
// @access Private
export const getWorkouts = asyncHandler(async (req, res) => {
	const workouts = await prisma.workout.findMany({
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			exercises: true
		}
	});

	res.json(workouts);
});

// @desc Create workout
// @route POST /api/workouts
// @access Private
export const createNewWorkout = asyncHandler(async (req, res) => {
	const { name, exerciseIds } = req.body;

	const workout = await prisma.workout.create({
		data: {
			name,
			exercises: {
				connect: exerciseIds.map(id => ({ id: +id }))
			}
		}
	});

	res.json(workout);
});

// @desc Delete workout
// @route DELETE /api/workouts/:id
// @access Private
export const deleteWorkout = asyncHandler(async (req, res) => {
	try {
		await prisma.workout.delete({
			where: {
				id: +req.params.id
			}
		});

		res.json({ message: 'Workout delete!' });
	} catch (error) {
		res.status(404);
		throw new Error('Workout not found!');
	}
});

// @desc Update workout
// @route PUT /api/workouts/:id
// @access Private
export const updateWorkout = asyncHandler(async (req, res) => {
	const { name, exerciseIds } = req.body;

	try {
		const updatedWorkout = await prisma.workout.update({
			where: {
				id: +req.params.id
			},
			data: {
				name,
				exercises: {
					set: exerciseIds.map(id => ({ id: +id }))
				}
			}
		});

		res.json(updatedWorkout);
	} catch (error) {
		res.status(404);
		throw new Error('Workout not found!');
	}
});
