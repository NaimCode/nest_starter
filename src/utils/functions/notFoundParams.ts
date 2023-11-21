import { HttpException } from '@nestjs/common';

const notFoundParams = (params: any, keys?: string[]) => {
  if (!params) {
    throw new HttpException('Params not found', 400);
  }

  if (keys) {
    for (const key of keys) {
      if (!params[key]) {
        throw new HttpException(`${key} not found`, 400);
      }
    }
  }
};

export default notFoundParams;
