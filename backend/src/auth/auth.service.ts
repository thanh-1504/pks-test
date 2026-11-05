import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { JWTService } from 'src/shared/services/jwt.service';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly jwtService: JWTService,
  ) {}

  async register(payload: RegisterDTO) {
    const existed = await this.authRepo.findUserByEmailOrId({
      email: payload.email,
    });
    if (existed) throw new ConflictException('Email đã được đăng ký mất rồi');
    try {
      const user = await this.authRepo.registerUser(payload);
      return {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ConflictException('Email đã được đăng ký mất rồi');
      throw error;
    }
  }

  async login(payload: LoginDTO) {
    const user = await this.authRepo.findUserByEmailOrId({
      email: payload.email,
    });
    const valid =
      user &&
      (await this.authRepo.checkCorrectPassword(
        payload.password,
        user.password,
      ));
    if (!valid || !user)
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAccessToken({
        sub: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      }),
      this.jwtService.signRefreshToken({ id: user.id, email: user.email }),
    ]);
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string) {
    let payload: { id: number; email: string };
    try {
      payload = await this.jwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }
    const user = await this.authRepo.findUserByEmailOrId({ id: payload.id });
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại');
    const accessToken = await this.jwtService.signAccessToken({
      sub: payload.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
    return {
      accessToken,
    };
  }
}
