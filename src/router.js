/* eslint-disable class-methods-use-this */
import page from 'page';

export class Router {
    constructor(host, routes, options) {
        if (Router._hasConstructed) {
            throw new Error('May not construct multiple routers.');
        }

        this.configure(options);

        this.host = host;
        this.view = undefined;

        this.page('*', (context, next) => {
            context.searchParams = {};
            const searchParams = new URLSearchParams(context.querystring);
            searchParams.forEach((value, key) => {
                context.searchParams[key] = value;
            });
            next();
        });

        this.addRoutes(routes);
        this.page(options);
        Router._hasConstructed = true;
    }

    configure(options) {
        this.page = page;
        if (options && options.customPage) {
            this.page = page.create();
        }
        if (options && options.basePath) {
            this.page.base(options.basePath);
        }
    }

    addRoute(r) {
        this.page(
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
                    this.view = r.view(context);
                    this.host.requestUpdate();
                } else {
                    next();
                }
            }
        );
    }

    addRoutes(routes) {
        if (typeof routes === 'function') {
            this.addRoutes(routes(this));
            return;
        }
        routes.forEach(r => {
            if (typeof r === 'function') {
                this.addRoutes(r(this));
            } else {
                this.addRoute(r);
            }
        });
    }

    redirect(path) {
        this.page.redirect(path);
    }
}

Router._hasConstructed = false;
