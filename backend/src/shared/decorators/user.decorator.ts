import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';

export const User = createParamDecorator(
  (
    field: keyof { id: number; email: string; role: Role },
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    return field ? request.user[field] : request.user;
  },
);
