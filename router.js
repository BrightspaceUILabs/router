import page from 'page';
import PubSub from './src/utils/pub-sub.js';

let activePage = page;
let _lastOptions = {};

export const _createReducedContext = pageContext => ({
	params: pageContext.params,
	search: pageContext.searchParams,
	path: pageContext.path,
	pathname: pageContext.pathname,
	hash: pageContext.hash,
	route: pageContext.routePath,
	title: pageContext.title,
	options: {},
});

const _routeChangePubSub = new PubSub();

const _handleRouteView = (context, r) => {
	if (r.view) {
		const reducedContext = _createReducedContext(context);
		context.view = (host, options) => {
			reducedContext.options = options || {};
			return r.view.call(host, reducedContext);
		};
		context.handled = true;
	}
};

const _handleRouteLoader = r => (context) => {
	if (r.loader) {
		r.loader().then(() => {
			_handleRouteView(context, r);

			// Publish the new context after the loading is complete.
			_routeChangePubSub.publish(context);
		});
	} else if (r.pattern && r.to) {
		activePage.redirect(r.to);
	} else {
		_handleRouteView(context, r);
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

	if (!options?.enableRouteOrderFix) console.warn('lit-router: The enableRouteOrderFix option is not enabled. This may cause issues with route handling. See here for details: https://github.com/BrightspaceUILabs/router/blob/main/README.md#route-order-inversion-issue');

	configure(options);

	activePage('*', (context, next) => {
		context.searchParams = {};
		const searchParams = new URLSearchParams(context.querystring);
		searchParams.forEach((value, key) => {
			context.searchParams[key] = value;
		});

		next();

		// Publish the new context after the route change is complete.
		_routeChangePubSub.publish(context);
	});

	// Simulate the route order inversion issue by reversing the routes if the enableRouteOrderFix option is not enabled.
	// TODO: Remove the reverse() call and the enableRouteOrderFix option once all consumers with a workaround have updated their implementation with the fix.
	_registerRoutes(options.enableRouteOrderFix ? routes : routes.reverse());

	activePage();
};

// Triggers navigation to the specified route path.
// Creates a new entry in the browser's history stack.
export const navigate = path => {
	activePage.show(path);
};

// Triggers navigation to the specified route path.
// Replaces the current entry in the browser's history stack.
export const redirect = path => {
	activePage.redirect(path);
};

export class ContextReactor {
	constructor(host, callback, initialize) {
		this.host = host;
		this.host?.addController(this);

		this._callback = callback;
		this._initialize = initialize;

		this._onRouteChange = this._onRouteChange.bind(this);

		if (!this.host) this.connect(); // Support for non-LitElement use cases
	}

	connect() {
		const initPage = _routeChangePubSub.getListenersCount() === 0;
		_routeChangePubSub.subscribe(this._onRouteChange, this._initialize);
		if (!hasRegistered && initPage) activePage();
	}

	disconnect() {
		_routeChangePubSub.unsubscribe(this._onRouteChange);
		if (!hasRegistered && _routeChangePubSub.getListenersCount() === 0) activePage.stop();
	}

	hostConnected() {
		this.connect();
	}

	hostDisconnected() {
		this.disconnect();
	}

	_onRouteChange(context) {
		this._callback?.(context);

		if (context.handled) this.host?.requestUpdate();
	}
}

export const RouterTesting = {
	reset: () => {
		activePage.stop();
		activePage = page.create();
		hasRegistered = false;
		_routeChangePubSub.clear();
	},

	restart: () => {
		activePage.start(_lastOptions);
	},
};
