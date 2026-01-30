export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
