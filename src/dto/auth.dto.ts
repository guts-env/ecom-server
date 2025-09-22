import { z } from 'zod';

export const RegisterDTOSchema = z.object({
  name: z.string('Name is required').min(1, 'Name is required').max(50, 'Name must not exceed 50 characters'),
  email: z.email('Invalid email format'),
  password: z.string('Password is required').min(6, 'Password must be at least 8 characters'),
});

export type RegisterDTO = z.infer<typeof RegisterDTOSchema>;

export const LoginDTOSchema = z.object({
  email: z.email('Invalid credentials'),
  password: z.string('Invalid credentials').min(1, 'Invalid credentials'),
});

export type LoginDTO = z.infer<typeof LoginDTOSchema>;

export interface AuthResponseDTO {
  success: boolean;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    token: string;
  };
}
