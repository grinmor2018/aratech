import { Coordinates } from './coordinates';
import { Enemies } from './enemies';

export class Scan {
  coordinates: Coordinates = new Coordinates();
  enemies: Enemies = new Enemies();
  allies?: number = 0;
}
