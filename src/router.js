/* eslint-disable class-methods-use-this */
import page from 'page';

let activePage = page;
let _lastOptions = {};

const _handleRouteView = (context, next, r) => {
    if (r.view) {
        const reducedContext = {
            params: context.params,
            search: context.searchParams,
            path: context.pathname,
        };
        context.view = r.view(reducedContext);
        context.handled = true;

        next();
    } else {
        next();
    }
};

const _handleRouteLoader = r => (context, next) => {
    if (r.loader) {
        r.loader().then(() => {
            _handleRouteView(context, next, r);
        });
    } else if (r.pattern && r.to) {
        activePage.redirect(r.pattern, r.to);
        next();
    } else {
        _handleRouteView(context, next, r);
    }
};

const _registerRoute = r => {
    activePage(r.pattern, _handleRouteLoader(r));
};

const _registerRoutes = routes => {
    if (typeof routes === 'function') {
        _registerRoutes(routes());
        return;
    }
    routes.forEach(r => {
        if (typeof r === 'function') {
            _registerRoutes(r());
        } else {
            _registerRoute(r);
        }
    });
};

const configure = options => {
    if (options && options.customPage) activePage = page.create();
    if (options && options.basePath) activePage.base(options.basePath);
    activePage(options);
    _lastOptions = options;
};

let hasRegistered = false;

export const registerRoutes = (routes, options) => {
    if (hasRegistered) throw new Error('May not construct multiple routers.');
    hasRegistered = true;

    configure(options);

    activePage('*', (context, next) => {
        context.searchParams = {};
        const searchParams = new URLSearchParams(context.querystring);
        searchParams.forEach((value, key) => {
            context.searchParams[key] = value;
        });
        next();
    });
    _registerRoutes(routes);
};

const addMiddleware = callback => {
    activePage('*', (ctx, next) => {
        callback(ctx);
        next();
    });
};

export const redirect = path => {
    activePage(path);
};

export class ContextReactor {
    constructor(host, callback) {
        ContextReactor.listeners.push({ host, callback });

        if (ContextReactor.listeners.length === 1) {
            addMiddleware(ctx => {
                ContextReactor.listeners.forEach(listener => {
                    listener.callback(ctx);
                    listener.host.requestUpdate();
                });
            });
        }
    }

    init() {
        activePage();
    }

    static reset() {
        this.listeners = [];
    }
}

ContextReactor.listeners = [];

export const RouterTesting = {
    reset: () => {
        activePage.stop();
        activePage = page.create();
        hasRegistered = false;
        ContextReactor.reset();
    },

    restart: () => {
        activePage.start(_lastOptions);
    },
};
