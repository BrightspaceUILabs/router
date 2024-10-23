import { html } from 'lit';
import { loader as peopleRouteLoader } from './people/route-loader.js';
import { loader as placesRouteLoader } from './places/route-loader.js';

import { registerRoutes } from '../router.js';

registerRoutes(
	[
		{
			pattern: '*',
			view: () => html`<h1>Not Found</h1>`,
		},
		{
			pattern: '/',
			loader: () => import('./home.js'),
			view: () => html`<test-home></test-home>`,
		},
		{
			pattern: '/home',
			to: '/',
		},
		peopleRouteLoader,
		placesRouteLoader,
	],
	{ basePath: '/example' }
);
