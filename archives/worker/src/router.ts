import { Router } from 'itty-router';
import { handleOptions } from './handlers/cors';
import * as subscription from './handlers/subscription';

const router = Router();

// cors
router.options('*', handleOptions);

// push subscription
router.post('/subscription', subscription.post);

export default router;
