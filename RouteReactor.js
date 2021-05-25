/* eslint-disable no-param-reassign */
import { ContextReactor } from './router.js';

export class RouteReactor extends ContextReactor {
    constructor(host) {
        super(host, ctx => {
            this.renderView = ctx.view;
            this.path = ctx.path;
            this.params = ctx.params;
            this.search = ctx.searchParams;
        });
        super.init();

        this.renderView = () => {};
    }
}
