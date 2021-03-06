import { Body, Controller, Post } from '@nestjs/common';
import { Envio } from './../models/envio';
import { RadarService } from './radar.service';

@Controller('radar')
export class RadarController {
  constructor(private radarService: RadarService) {}

  @Post()
  async move(@Body() envio: Envio) {
    const coords = this.radarService.calculate(envio);
    return coords;
  }
}
