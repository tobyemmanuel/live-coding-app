import { useMutation } from '@tanstack/react-query';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth';
import { ApiResponse } from './types';

const login = async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
  // Simulated API call
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

const register = async (credentials: RegisterCredentials): Promise<ApiResponse<User>> => {
  // Simulated API call
  const response = await fetch('/api/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

export const useLogin = () => useMutation({ mutationFn: login });
export const useRegister = () => useMutation({ mutationFn: register });