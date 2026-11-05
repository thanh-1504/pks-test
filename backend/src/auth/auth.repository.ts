import { Injectable } from '@nestjs/common';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { RegisterDTO } from './auth.dto';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  findUserByEmailOrId(where: { email: string } | { id: number }) {
    return this.prismaService.user.findFirst({
      where: { ...where, deletedAt: null },
    });
  }

  async registerUser(payload: RegisterDTO) {
    const { fullName, email, password } = payload;
    return this.prismaService.user.create({
      data: {
        fullName,
        email,
        password: await this.hashingService.hashPassword(password),
      },
    });
  }

  async checkCorrectPassword(password: string, hashedPassword: string) {
    return this.hashingService.comparePassword(password, hashedPassword);
  }
}
