import { Coordinates } from '../models/coordinates';
import { Envio } from '../models/envio';
import { Injectable } from '@nestjs/common';
import { Protocol } from '../models/protocols';
import { Scan } from '../models/scan';
import { TypeEnemies } from '../models/typeEnemies';

@Injectable()
export class RadarService {
  private location: Coordinates = new Coordinates();
  private scanSelected: Scan = new Scan();
  private scansSelected: Scan[] = [];

  async calculate(envio: Envio): Promise<Coordinates> {
    const coords = (await this.selectScan(envio)).coordinates;
    return coords;
  }

  async distanceMeasure(coords: Coordinates): Promise<number> {
    const distance = Math.sqrt(
      (coords.x - this.location.x) ** 2 + (coords.y - this.location.y) ** 2
    );
    return distance;
  }

  async loop(protocol: Protocol, scans: Scan[]) {
    let distanceClose = 100;
    let distanceFurther = 0;
    for (let i = 0; i < scans.length; i++) {
      if (
        protocol === Protocol.avoidCrossfire ||
        protocol === Protocol.assistAllies
      ) {
        if (scans[i].allies > 0) {
          if (protocol === Protocol.avoidCrossfire) {
            scans.splice(i, 1);
            i--;
          } else {
            this.scansSelected.push(scans[i]);
          }
        }
      }
      if (
        protocol === Protocol.avoidMech ||
        protocol === Protocol.prioritizeMech
      ) {
        if (scans[i].enemies.type === TypeEnemies.mech) {
          if (protocol === Protocol.avoidMech) {
            scans.splice(i, 1);
            i--;
          } else {
            this.scansSelected.push(scans[i]);
          }
        }
      }
      if (
        protocol === Protocol.closestEnemies ||
        protocol === Protocol.furthestEnemies
      ) {
        const distanceFinal = await this.distanceMeasure(scans[i].coordinates);
        if (protocol === Protocol.closestEnemies) {
          if (distanceFinal <= distanceClose) {
            distanceClose = distanceFinal;
            this.scanSelected = scans[i];
          }
        } else {
          if (distanceFinal > distanceFurther && distanceFinal <= 100) {
            distanceFurther = distanceFinal;
            this.scanSelected = scans[i];
          }
        }
      }
    }
  }

  async selectScan(envio: Envio): Promise<Scan> {
    let scans = envio.scan;
    const protocolSelected = envio.protocols;
    if (protocolSelected.includes(Protocol.avoidCrossfire)) {
      await this.loop(Protocol.avoidCrossfire, scans);
      this.scanSelected = scans[0];
    }
    if (protocolSelected.includes(Protocol.avoidMech)) {
      await this.loop(Protocol.avoidMech, scans);
      this.scanSelected = scans[0];
    }
    if (protocolSelected.includes(Protocol.prioritizeMech)) {
      await this.loop(Protocol.prioritizeMech, scans);
      if (this.scansSelected.length > 0) {
        scans = this.scansSelected;
      }
      this.scanSelected = scans[0];
    }
    if (protocolSelected.includes(Protocol.assistAllies)) {
      await this.loop(Protocol.assistAllies, scans);
      if (this.scansSelected.length > 0) {
        scans = this.scansSelected;
        this.scanSelected = scans[0];
      }
    }
    if (protocolSelected.includes(Protocol.closestEnemies)) {
      await this.loop(Protocol.closestEnemies, scans);
    }
    if (protocolSelected.includes(Protocol.furthestEnemies)) {
      this.loop(Protocol.furthestEnemies, scans);
    }
    return this.scanSelected;
  }
}
