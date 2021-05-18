import { html } from 'lit-element';

export function loader() {
    return [
        {
            pattern: '/example/places',
            loader: () => import('./places.js'),
            view: () => html`<test-places></test-places>`,
        },
        {
            pattern: '/example/places/:id',
            loader: () => import('./place.js'),
            view: context =>
                html`<test-place place-id="${context.params.id}"></test-place>`,
        },
    ];
}
