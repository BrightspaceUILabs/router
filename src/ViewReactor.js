/* eslint-disable no-param-reassign */
import { ContextReactor } from './router.js';

export class ViewReactor extends ContextReactor {
    constructor(host) {
        super(host, ctx => {
            this.view = ctx.view;
        });
        super.init();
    }
}
