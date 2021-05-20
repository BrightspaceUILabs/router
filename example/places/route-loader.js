import { html } from 'lit-element';

export function loader() {
    return [
        {
            pattern: '/places',
            loader: () => import('./places.js'),
            view: () => html`<test-places></test-places>`,
        },
        {
            pattern: '/places/:id',
            loader: () => import('./place.js'),
            view: id => html`<test-place place-id="${id}"></test-place>`,
        },
    ];
}
