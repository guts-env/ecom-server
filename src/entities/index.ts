interface IBaseEntity {
  id: string;
  created_at: Date;
}

interface IUser extends IBaseEntity {
  name: string;
  email: string;
  hashed_password: string;
}

export type { IBaseEntity, IUser };
