import { Global, Module } from '@nestjs/common';
import { HashingService } from '../services/hashing.service';
import { PrismaService } from '../services/prisma.service';

@Global()
@Module({
  imports: [],
  providers: [PrismaService, HashingService],
  exports: [PrismaService, HashingService],
})
export class ShareModule {}
