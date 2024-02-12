import { prisma } from '../prisma.js';
import asyncHandler from 'express-async-handler';
import { UserFields } from '../utils/user.util.js';

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			id: req.user.id
		},
		select: UserFields
	});

	const countExerciseTimesCompleted = await prisma.exerciseLog.count({
		where: {
			userId: user.id,
			isCompleted: true
		}
	});

	const kgs = await prisma.exerciseTime.aggregate({
		where: {
			exerciseLog: {
				userId: user.id
			},
			isCompleted: true
		},
		_sum: {
			weight: true
		}
	});

	const workouts = await prisma.workoutLog.count({
		where: {
			userId: user.id,
			isCompleted: true
		}
	});

	const statistics = [
		{
			label: 'Minutes',
			value: Math.ceil(countExerciseTimesCompleted * 2.3) || 0
		},
		{
			label: 'Workouts',
			value: workouts || 0
		},
		{
			label: 'Kgs',
			value: kgs._sum.weight || 0
		}
	];

	res.json({ ...user, statistics });
});
