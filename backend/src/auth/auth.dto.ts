import { createZodDto } from 'nestjs-zod';
import { LoginSchema, RefreshTokenSchema, RegisterSchema } from './auth.schema';

export class RegisterDTO extends createZodDto(RegisterSchema) {}
export class LoginDTO extends createZodDto(LoginSchema) {}
export class RefreshTokenDTO  extends createZodDto(RefreshTokenSchema) {}
