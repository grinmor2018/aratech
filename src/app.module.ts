import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { RadarController } from './radar/radar.controller';
import { RadarService } from './radar/radar.service';
import { RadarModule } from './radar/radar.module';

@Module({
  imports: [RadarModule],
  controllers: [AppController, RadarController],
  providers: [AppService, RadarService],
})
export class AppModule {}
