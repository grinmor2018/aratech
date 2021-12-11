import { Coordinates } from './../models/coordinates';
import { Envio } from '../models/envio';
import { Injectable } from '@nestjs/common';
import { Protocol } from 'src/models/protocols';
import { Scan } from './../models/scan';
import { TypeEnemies } from './../models/typeEnemies';

@Injectable()
export class RadarService {
  private location: Coordinates = new Coordinates();

  async calculate(envio: Envio): Promise<Coordinates> {
    let coords = new Coordinates();
    const scanSelected = this.selectScan(envio);
    coords = (await scanSelected).coordinates;
    //this.location = coords;
    return coords;
  }
  async selectScan(envio: Envio): Promise<Scan> {
    let scanSelected: Scan = new Scan();
    const scansSelected = [];
    let scans = envio.scan;
    let distance = 0;
    console.log('scans: ', scans);
    const protocolSelected = envio.protocols;
    if (protocolSelected.includes(Protocol.avoidCrossfire)) {
      for (let i = 0; i < scans.length; i++) {
        if (scans[i].allies > 0) {
          scans.splice(i, 1);
          i--;
        }
      }
      scanSelected = scans[0];
      console.log('Elimino allies');
    } else if (protocolSelected.includes(Protocol.avoidMech)) {
      for (let i = 0; i < scans.length; i++) {
        if (scans[i].enemies.type === TypeEnemies.mech) {
          scans.splice(i, 1);
          i--;
        }
      }
      scanSelected = scans[0];
      console.log('Elimino mechs');
    } else if (protocolSelected.includes(Protocol.prioritizeMech)){
      for (let i = 0; i < scans.length; i++) {
        if (scans[i].enemies.type === TypeEnemies.mech) {
          scansSelected.push(scans[i]);
        }
      }
      if (scansSelected.length > 0) {
        scans = scansSelected;
      }
      scanSelected = scans[0];
      console.log('Hay mechs');
    }
    for (const p of protocolSelected) {
      console.log(p);
      switch (p) {
        case 'assist-allies':
          for (let i = 0; i < scans.length; i++) {
            if (scans[i].allies > 0) {
              scansSelected.push(scans[i]);
            }
          }
          if (scansSelected.length > 0) {
            scans = scansSelected;
            scanSelected = scans[0];
          }
          break;
        case 'closest-enemies':
          distance = 100;
          for (let i = 0; i < scans.length; i++) {
            const distanceFinal = await this.distance(scans[i].coordinates);
            if (distanceFinal <= distance) {
              distance = distanceFinal;
              scanSelected = scans[i];
            }
          }
          break;
        case 'furthest-enemies':
          distance = await this.distance(this.location);
          for (let i = 0; i < scans.length; i++) {
            const distanceFinal = await this.distance(scans[i].coordinates);
            if (distanceFinal > distance && distanceFinal < 100) {
              distance = distanceFinal;
              scanSelected = scans[i];
            }
          }
          break;
      }
    }
    console.log('scanSelected: ', scanSelected);
    return scanSelected;
  }

  async distance(coords: Coordinates): Promise<number> {
    const distance = Math.sqrt(
      (coords.x - this.location.x) ** 2 + (coords.y - this.location.y) ** 2,
    );
    console.log(
      'location: ',
      this.location,
      'coords: ',
      coords,
      'distancia: ',
      distance,
    );
    return distance;
  }
}
