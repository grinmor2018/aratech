import { Body, Controller, Post } from '@nestjs/common';
import { Coordinates } from 'src/models/coordinates';
import { Envio } from './../models/envio';
import { RadarService } from './radar.service';
/* eslint-disable @typescript-eslint/no-empty-function */

@Controller('radar')
export class RadarController {
  constructor(private radarService: RadarService) {}

  @Post()
  async move(@Body() envio: Envio): Promise<Coordinates> {
    const coords = this.radarService.calculate(envio);
    return coords;
  }
}
