import * as migration_20261124_190128_initial from './20261124_190128_initial';
import * as migration_20261124_204509_placements_city_and_import from './20261124_204509_placements_city_and_import';

export const migrations = [
  {
    up: migration_20261124_190128_initial.up,
    down: migration_20261124_190128_initial.down,
    name: '20261124_190128_initial',
  },
  {
    up: migration_20261124_204509_placements_city_and_import.up,
    down: migration_20261124_204509_placements_city_and_import.down,
    name: '20261124_204509_placements_city_and_import',
  },
];
