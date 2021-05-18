import { addMiddleware } from './router.js';

export class ViewReactor {
    constructor(host) {
        ViewReactor.hosts.push(host);
        ViewReactor.instances.push(this);

        if (ViewReactor.hosts.length === 1) {
            addMiddleware(ctx => {
                ViewReactor.instances.forEach(instance => {
                    // eslint-disable-next-line no-param-reassign
                    instance.view = ctx.view;
                });
                ViewReactor.hosts.forEach(h => {
                    h.requestUpdate();
                });
            });
        }
    }
}

ViewReactor.hosts = [];
ViewReactor.instances = [];
