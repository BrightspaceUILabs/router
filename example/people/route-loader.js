import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import { redirect } from '../../src/router.js';

export function loader() {
    return [
        {
            pattern: '/people',
            loader: () => import('./people.js'),
            view: search => html` <test-people
                @filter-change="${e =>
                    redirect(`/example/people?filter=${e.detail.value}`)}"
                filter="${ifDefined(search.filter)}"
            ></test-people>`,
        },
        {
            pattern: '/people/:id',
            loader: () => import('./person.js'),
            view: id => html`<test-person person-id="${id}"></test-person>`,
        },
    ];
}
