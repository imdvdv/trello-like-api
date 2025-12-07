import { Module } from '@nestjs/common';
import { OwnerGuard } from './owner.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  providers: [OwnerGuard, JwtAuthGuard],
  exports: [OwnerGuard, JwtAuthGuard],
})
export class GuardsModule {}
