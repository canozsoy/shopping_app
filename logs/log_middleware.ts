import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import fsPromise from 'fs/promises';

function writeToFile(item:string, fileName:string, header?:string) {
  const writeStream = fs.createWriteStream(fileName, { flags: 'a' });
  if (header) {
    writeStream.write(header);
  }
  writeStream.write(item);
}

const logMiddleware = (req:Request, res:Response, next:NextFunction) => {
  const fileName = './logs/request_logs.txt';
  const items = [
    (new Date()).toISOString(),
    req.method,
    req.url,
    req.headers['x-forwarded-for'] || req.socket.remoteAddress,
  ];
  const row = `${items.join(',')}\n`;

  fsPromise.open(fileName, 'r')
    .then(() => {
      writeToFile(row, fileName);
    }).catch(() => {
      const header = 'Date,Method,URL,IP\n';
      writeToFile(row, fileName, header);
    });

  next();
};

export default logMiddleware;
