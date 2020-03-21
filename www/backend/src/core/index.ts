import { start as startExpress } from './express';
import { start as startImap } from './imap';

export const initialize = () => Promise.all([startExpress(), startImap()]);
