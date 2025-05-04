// src/types/express.d.ts
import { User } from '../auth/interfaces/user.interface'; // Ajuste o caminho

declare global {
  namespace Express {
    interface Request {
      user?: User; // Use sua interface de usuário
    }
  }
}