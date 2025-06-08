export interface User {
    id: string;
    email: string;
    name: string;
    photo?: string;
  }
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  export interface RegisterCredentials extends LoginCredentials {
    name: string;
  }