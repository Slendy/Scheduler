import { z } from 'zod';

export const loginSchema = z.object({
	username: z.string().min(1, { message: 'Field cannot be blank' }),
	password: z.string().min(1, { message: 'Field cannot be blank' }).max(100)
});
