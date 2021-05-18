import { html } from 'lit-element';
import { loader as peopleRouteLoader } from './people/route-loader.js';
import { loader as placesRouteLoader } from './places/route-loader.js';

export function loader() {
    return [
        {
            pattern: '/example',
            loader: () => import('./home.js'),
            view: () => html`<test-home></test-home>`,
        },
        peopleRouteLoader,
        placesRouteLoader,
        {
            pattern: '*',
            view: () => html`<h1>Not Found</h1>`,
        },
    ];
}
