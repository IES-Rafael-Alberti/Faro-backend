import { Request } from 'express';

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|bin)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
