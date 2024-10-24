import { _createReducedContext, ContextReactor } from './router.js';

export class RouteReactor {
	constructor(host) {
		this.host = host;

		this._updateState = this._updateState.bind(this);
		this._contextReactor = new ContextReactor(host, this._updateState, this._updateState);
	}

	renderView(opts) {
		return this._view?.(this.host, opts);
	}

	_updateState(ctx) {
		const reduced = _createReducedContext(ctx);
		Object.keys(reduced).forEach(ctxKey => {
			this[ctxKey] = reduced[ctxKey];
		});

		this._view = ctx.view;
	}
}
