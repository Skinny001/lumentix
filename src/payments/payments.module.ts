import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { EventsModule } from '../events/events.module';
import { StellarModule } from '../stellar/stellar.module';
import { AuditService } from 'src/audit/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), EventsModule, StellarModule],
  providers: [PaymentsService, AuditService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
