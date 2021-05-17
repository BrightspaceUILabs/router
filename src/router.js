/* eslint-disable class-methods-use-this */
import page from 'page';

export class Router {
    constructor(host, routes) {
        this.host = host;
        this.view = undefined;

        page('*', (context, next) => {
            context.searchParams = {};
            const searchParams = new URLSearchParams(context.querystring);
            searchParams.forEach((value, key) => {
                context.searchParams[key] = value;
            });
            next();
        });

        this.addRoutes(routes);
        page();
    }

    addRoute(r) {
        page(
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
        page.redirect(path);
    }
}
