import { Coordinates } from './../models/coordinates';
import { Envio } from '../models/envio';
import { Injectable } from '@nestjs/common';
import { Scan } from './../models/scan';

@Injectable()
export class RadarService {
  async calculate(envio: Envio): Promise<Coordinates> {
    let coords = new Coordinates();
    const scanSelected = this.selectScan(envio);
    coords = scanSelected.coordinates;
    console.log(coords);
    return coords;
  }
  selectScan(envio: Envio): Scan {
    const scanSelected = envio.scan[0];
    const protocolSelected = envio.protocols;

    
    return scanSelected;
  }
}
