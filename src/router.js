/* eslint-disable class-methods-use-this */
import page from 'page';

let activePage = page;

const _registerRoute = r => {
    activePage(
        r.pattern,
        (context, next) => {
            if (r.loader) {
                r.loader().then(() => next());
            } else {
                next();
            }
        },
        (context, next) => {
            if (r.view) {
                context.view = r.view(context);
                context.handled = true;
                next();
            } else {
                next();
            }
        }
    );
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
};

export const registerRoutes = (routes, options) => {
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

export const addMiddleware = callback => {
    activePage('*', (ctx, next) => {
        callback(ctx);
        next();
    });
    activePage();
};

export const resetForTesting = () => {
    activePage.stop();
    activePage = page.create();
};

export const redirect = path => {
    activePage(path);
};
