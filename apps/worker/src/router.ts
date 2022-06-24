import { Router } from 'itty-router';
import { Env } from '.';

const router = Router();

router.get('/', (request: Request, env: Env, context: ExecutionContext) => {
    // now have access to the env (where CF bindings like durables, KV, etc now are)
});
