/**
 * Entity Data for The Whisker Shogunate
 *
 * All world-building entities (materials, locations, characters, etc.)
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '..');

export interface Entity {
  id: string;
  type: string;
  name: string;
  description: string;
  [key: string]: any;
}

/**
 * Load all entities from a directory
 */
export async function loadEntities(pattern: string): Promise<Map<string, Entity>> {
  const entities = new Map<string, Entity>();
  const files = await glob(pattern, { cwd: DATA_DIR });

  for (const file of files) {
    const filePath = join(DATA_DIR, file);
    try {
      const content = readFileSync(filePath, 'utf-8');
      const entity = JSON.parse(content) as Entity;
      if (entity.id) {
        entities.set(entity.id, entity);
      }
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }

  return entities;
}

/**
 * Load all materials
 */
export async function loadMaterials(): Promise<Map<string, Entity>> {
  return loadEntities('materials/**/*.json');
}

/**
 * Load all locations
 */
export async function loadLocations(): Promise<Map<string, Entity>> {
  return loadEntities('locations/**/*.json');
}

/**
 * Load all characters
 */
export async function loadCharacters(): Promise<Map<string, Entity>> {
  return loadEntities('characters/**/*.json');
}

/**
 * Load all professions
 */
export async function loadProfessions(): Promise<Map<string, Entity>> {
  return loadEntities('professions/**/*.json');
}

/**
 * Load all entities of all types
 */
export async function loadAllEntities(): Promise<Map<string, Entity>> {
  return loadEntities('**/*.json');
}

/**
 * Get entity by ID
 */
export async function getEntity(id: string): Promise<Entity | undefined> {
  const all = await loadAllEntities();
  return all.get(id);
}
