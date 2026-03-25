export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  workspaceName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
};
