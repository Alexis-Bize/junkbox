import * as dotenv from 'dotenv';
import { join } from 'path';

if (process.env.NOW_LAMBA !== 'yes') {
	if (process.env.NODE_ENV === 'development') {
		dotenv.config({
			path: join(__dirname, '../../../.env.development.local')
		});
	} else dotenv.config({ path: join(__dirname, '../../../.env') });
}
