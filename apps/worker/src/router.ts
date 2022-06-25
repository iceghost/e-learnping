import { Router } from 'itty-router';
import { handleOptions } from './handlers/cors';
import * as subscription from './handlers/subscription';
import * as update from './handlers/update';

const router = Router();

// cors
router.options('*', handleOptions);

// push subscription
router.post('/subscription', subscription.post);
router.get('/updates', update.getAll);

export default router;
