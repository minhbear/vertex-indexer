import { readdirSync } from 'fs';
import * as fs from 'node:fs';
import { join } from 'path';

const entities = [];
const entitiesPath = join(__dirname);
const viewsPath = join(__dirname, '../views/');
if (fs.existsSync(entitiesPath)) {
  readdirSync(entitiesPath).forEach((file) => {
    if (file.endsWith('.entity.ts') || file.endsWith('.entity.js')) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const entity = require(join(entitiesPath, file));
      entities.push(...Object.values(entity));
    }
  });
}

if (fs.existsSync(viewsPath)) {
  readdirSync(viewsPath).forEach((file) => {
    if (file.endsWith('.view.ts') || file.endsWith('.view.js')) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const entity = require(join(viewsPath, file));
      entities.push(...Object.values(entity));
    }
  });
}

export default entities;
