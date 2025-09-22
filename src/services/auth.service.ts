import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import type { IUser } from '@/entities';
import { AuthError } from '@/errors';
import { config } from '@/config';
import type { RegisterDTO, LoginDTO, AuthResponseDTO } from '@/dto/auth.dto';
import UserRepository from '@/repositories/user.repository';
import { INVALID_CREDENTIALS, USER_EXISTS } from '@/constants/errors';

export default class AuthService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: RegisterDTO): Promise<void> {
    try {
      const existingUser = this.userRepository.getUserByEmail(data.email);
      if (existingUser) {
        throw new AuthError(USER_EXISTS.code, USER_EXISTS.message, USER_EXISTS.statusCode);
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newUser: IUser = {
        id: uuidv4(),
        name: data.name,
        email: data.email,
        hashed_password: hashedPassword,
        created_at: new Date(),
      };

      return this.userRepository.createUser(newUser);
    } catch (error) {
      throw error;
    }
  }

  async login(data: LoginDTO): Promise<AuthResponseDTO> {
    try {
      const user = this.userRepository.getUserByEmail(data.email);
      if (!user) {
        throw new AuthError(INVALID_CREDENTIALS.code, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
      }

      await this.comparePassword(data.password, user.hashed_password);
      const token = this.generateToken(user.id, user.email);

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          token,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new AuthError(INVALID_CREDENTIALS.code, INVALID_CREDENTIALS.message, INVALID_CREDENTIALS.statusCode);
    }
    return isPasswordValid;
  }

  private generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, config.JWT_SECRET, { expiresIn: '15m' });
  }
}
