import { Response } from 'express';

type Payload<T = any> = {
  message?: string;
  data?: T;
  success?: boolean;
};

export const success = <T = any>(res: Response, data?: T, message = 'Success', code = 200) => {
  const body: Payload<T> = { success: true, message, data };
  return res.status(code).json(body);
};

export const fail = (res: Response, message = 'Failure', code = 400, data?: any) => {
  const body: Payload = { success: false, message, data };
  return res.status(code).json(body);
};

export const custom = <T = any>(res: Response, params: { code: number; success: boolean; message?: string; data?: T }) => {
  const { code, success: ok, message, data } = params;
  const body: Payload<T> = { success: ok, message, data };
  return res.status(code).json(body);
};

export default { success, fail, custom };
