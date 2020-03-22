import * as dotenv from 'dotenv';
import { join } from 'path';

const env = process.env.NODE_ENV || '';
const production = env === 'production';
const labma = process.env.NOW_LAMDA === 'yes';
const loadEnvironmentFile = production === false || labma === false;

if (loadEnvironmentFile === true) {
	const envFile = !!production ? '.env' : `.env-${env}`;
	dotenv.config({ path: join(__dirname, `../../../${envFile}`) });
}
