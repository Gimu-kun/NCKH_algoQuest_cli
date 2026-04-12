import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const schemaPath = path.join(
  root,
  'src',
  'data',
  'study_materials',
  'challenge_types',
  'algorithm-challenge.schema.json',
);
const samplePath = path.join(
  root,
  'src',
  'data',
  'study_materials',
  'challenge_types',
  'algorithm-challenge.sample.json',
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function main() {
  const schema = readJson(schemaPath);
  const sample = readJson(samplePath);

  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
    unevaluated: true,
  });
  const validate = ajv.compile(schema);
  const valid = validate(sample);

  if (valid) {
    console.log('Challenge schema validation passed.');
    process.exit(0);
  }

  console.error('Challenge schema validation failed.');
  for (const err of validate.errors ?? []) {
    const dataPath = err.instancePath || '/';
    console.error(`- ${dataPath}: ${err.message}`);
  }
  process.exit(1);
}

main();
