import { _createReducedContext, ContextReactor } from './router.js';

export class RouteReactor {
	constructor(host) {
		this.host = host;

		const updateState = (ctx) => {
			const reduced = _createReducedContext(ctx);

			Object.keys(reduced).forEach(ctxKey => {
				this[ctxKey] = reduced[ctxKey];
			});

			this._view = ctx.view;
		};
		this._contextReactor = new ContextReactor(host, updateState, updateState);
	}

	renderView(opts) {
		return this._view?.(this.host, opts);
	}
}
