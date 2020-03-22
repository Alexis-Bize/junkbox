import mailbox from './mailbox';
import { Router } from 'express';
import { onNotFound } from '../helpers';

export default [
	mailbox,
	() => Router().get('/*', (_req, res) => onNotFound(res))
];
