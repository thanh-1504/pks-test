import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Global()
@Module({
  imports: [],
  providers: [PrismaService],
  exports: [],
})
export class ShareModule {}
