/* eslint-disable no-param-reassign */
import { addMiddleware } from './router.js';

export class RouteReactor {
    constructor(host) {
        RouteReactor.hosts.push(host);
        RouteReactor.instances.push(this);

        if (RouteReactor.hosts.length === 1) {
            addMiddleware(ctx => {
                RouteReactor.instances.forEach(instance => {
                    instance.path = ctx.path;
                    instance.search = new URLSearchParams(ctx.search);
                    instance.params = ctx.params;
                });
                RouteReactor.hosts.forEach(h => {
                    h.requestUpdate();
                });
            });
        }
    }
}

RouteReactor.hosts = [];
RouteReactor.instances = [];
