import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const config = {
  environmentsFolder: join(projectRoot, 'environments'),
  selectorFile: '.env',
  selectorKey: 'APP_ENV',
  environmentFileSuffix: '-env',
  environmentNames: ['dev', 'qa', 'prod'],
  outputFile: join(projectRoot, 'src', 'app', 'core', 'config', 'environment.generated.ts'),
  schema: {
    PRODUCTION: { property: 'production', type: 'boolean' },
    API_BASE_URL: { property: 'apiBaseUrl', type: 'url' },
  },
};

function fail(message) {
  console.error(`\n[environment] ${message}\n`);
  process.exit(1);
}

function parseEnvFile(path) {
  if (!existsSync(path)) {
    fail(`No existe el archivo ${path}`);
  }

  const values = {};

  for (const rawLine of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();

    if (line === '' || line.startsWith('#')) {
      continue;
    }

    const separator = line.indexOf('=');

    if (separator === -1) {
      fail(`Línea inválida en ${path}: "${line}". Usa el formato CLAVE=valor.`);
    }

    const key = line.slice(0, separator).trim();
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^(['"])(.*)\1$/, '$2');

    values[key] = value;
  }

  return values;
}

function selectEnvironmentName() {
  const selector = parseEnvFile(join(config.environmentsFolder, config.selectorFile));
  const name = selector[config.selectorKey];

  if (!config.environmentNames.includes(name)) {
    fail(
      `${config.selectorKey} en environments/${config.selectorFile} vale "${name ?? ''}". ` +
        `Usa uno de: ${config.environmentNames.join(', ')}.`,
    );
  }

  return name;
}

function convert(name, key, rawValue, definition) {
  const origin = `environments/${name}${config.environmentFileSuffix}`;

  if (rawValue === undefined || rawValue === '') {
    fail(`Falta ${key} en ${origin}. Completa su valor.`);
  }

  if (definition.type === 'boolean') {
    if (rawValue !== 'true' && rawValue !== 'false') {
      fail(`${key} en ${origin} debe ser true o false (valor actual: "${rawValue}").`);
    }
    return rawValue === 'true';
  }

  if (definition.type === 'url') {
    if (!/^https?:\/\/\S+$/.test(rawValue)) {
      fail(`${key} en ${origin} debe ser una URL http(s) (valor actual: "${rawValue}").`);
    }
    return rawValue.replace(/\/+$/, '');
  }

  return rawValue;
}

function toTypeScript(value) {
  return typeof value === 'string'
    ? `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
    : String(value);
}

function buildSource(name, values) {
  const lines = [
    `  name: ${toTypeScript(name)},`,
    ...Object.entries(config.schema).map(
      ([key, definition]) => `  ${definition.property}: ${toTypeScript(values[key])},`,
    ),
  ];

  return [
    `import { AppEnvironment } from '../models/app-environment.interface';`,
    '',
    'export const environment: AppEnvironment = {',
    ...lines,
    '};',
    '',
  ].join('\n');
}

const name = selectEnvironmentName();
const rawValues = parseEnvFile(
  join(config.environmentsFolder, `${name}${config.environmentFileSuffix}`),
);

const values = Object.fromEntries(
  Object.entries(config.schema).map(([key, definition]) => [
    key,
    convert(name, key, rawValues[key], definition),
  ]),
);

mkdirSync(dirname(config.outputFile), { recursive: true });
writeFileSync(config.outputFile, buildSource(name, values), 'utf8');

console.log(`[environment] ${name} -> ${values.API_BASE_URL}`);
