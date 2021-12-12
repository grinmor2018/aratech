import { Coordinates } from './../models/coordinates';
import { Envio } from './../models/envio';
import { RadarController } from './radar.controller';
import { RadarService } from './radar.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('RadarController', () => {
  let controller: RadarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: RadarService, useValue: {} }],
      controllers: [RadarController],
    }).compile();

    controller = module.get<RadarController>(RadarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
