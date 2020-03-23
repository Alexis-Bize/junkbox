import mailbox from './mailbox';
import { Router } from 'express';
import { onNotFound } from '..';

export default [
	mailbox,
	() => Router().get('/*', (_req, res) => onNotFound(res))
];
