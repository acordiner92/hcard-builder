import { Request, Response } from 'express';

export const get = (request: Request, response: Response): Response => {
  return response.send('get');
};

export const submit = (request: Request, response: Response): Response => {
  return response.send('submit');
};

export const update = (request: Request, response: Response): Response => {
  return response.send('update');
};
