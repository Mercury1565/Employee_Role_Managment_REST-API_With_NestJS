import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PositionModule } from './positions/position.module';

@Module({
  imports: [DatabaseModule, PositionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}