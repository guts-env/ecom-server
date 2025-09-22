import type { IUser } from '@/entities';

export default class UserRepository {
  private users: IUser[] = [];

  createUser(user: IUser): void {
    this.users.push(user);
  }

  getUserByEmail(email: string): IUser | null {
    return this.users.find((user) => user.email === email) || null;
  }
}
