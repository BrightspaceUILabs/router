import { _createReducedContext, ContextReactor } from './router.js';

export class RouteReactor extends ContextReactor {
	constructor(host) {
		super(host, ctx => {
			const reduced = _createReducedContext(ctx);

			Object.keys(reduced).forEach(ctxKey => {
				this[ctxKey] = reduced[ctxKey];
			});

			this.renderView = opts => ctx.view?.(host, opts);

			// this.path = ctx.pathname;
			// this.params = ctx.params;
			// this.search = ctx.searchParams;
		});
		this.renderView = () => {};
		super.init();
	}
}
