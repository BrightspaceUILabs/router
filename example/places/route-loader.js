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
            view: params =>
                html`<test-place place-id="${params.id}"></test-place>`,
        },
    ];
}
