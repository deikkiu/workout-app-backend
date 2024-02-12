import { prisma } from '../prisma.js';
import asyncHandler from 'express-async-handler';
import { hash, verify } from 'argon2';
import { generateToken } from './generate-token.js';
import { UserFields } from '../utils/user.util.js';

// @desc Auth user
// @route POST /api/auth/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await prisma.user.findUnique({
		where: {
			email
		}
	});

	if (!user) {
		res.status(400);
		throw new Error('User does not exist!');
	}

	const isValidPassword = await verify(user.password, password);

	if (isValidPassword) {
		const token = generateToken(user.id);
		res.json({ user, token });
	} else {
		res.status(401);
		throw new Error('Password is not correct!');
	}
});

// @desc Register user
// @route POST /api/auth/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const isHaveUser = await prisma.user.findUnique({
		where: {
			email
		}
	});

	if (isHaveUser) {
		res.status(400);
		throw new Error('User already exists!');
	}

	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: await hash(password)
		},
		select: UserFields
	});

	const token = generateToken(user.id);

	res.json({ user, token });
});
