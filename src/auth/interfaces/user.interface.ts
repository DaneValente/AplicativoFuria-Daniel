// src/auth/interfaces/user.interface.ts
export interface User {
    id: string;
    username: string;
    displayName: string;
    email?: string;
    token: string;
    tokenSecret: string;
  }