import { User } from 'src/users/schemas/user.schema';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
