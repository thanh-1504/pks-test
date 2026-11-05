import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'generated/prisma/enums';
@Injectable()
export class JWTService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signAccessToken(payload: {
    sub: number;
    fullName: string;
    email: string;
    role: Role;
  }) {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: (this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRES_IN',
      ) ?? '1d') as any,
    });
    return token;
  }

  async signRefreshToken(payload: { id: number; email: string }) {
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN') ??
        ('7d' as any),
    });
    return token;
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });
  }
}
