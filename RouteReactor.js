/* eslint-disable no-param-reassign */
import { ContextReactor, _createReducedContext } from './router.js';

export class RouteReactor extends ContextReactor {
    constructor(host) {
        super(host, ctx => {
            const reduced = _createReducedContext(ctx);

            Object.keys(reduced).forEach(ctxKey => {
                this[ctxKey] = reduced[ctxKey];
            });

            this.renderView = ctx.view ? ctx.view : () => {};

            // this.path = ctx.pathname;
            // this.params = ctx.params;
            // this.search = ctx.searchParams;
        });
        this.renderView = () => {};
        super.init();
    }
}
