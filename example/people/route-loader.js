import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import { redirect } from '../../router.js';

export function loader() {
    return [
        {
            pattern: '/people',
            loader: () => import('./people.js'),
            view: ctx => html` <test-people
                @filter-change="${e =>
                    redirect(`/example/people?filter=${e.detail.value}`)}"
                filter="${ifDefined(ctx.search.filter)}"
            ></test-people>`,
        },
        {
            pattern: '/people/:id',
            loader: () => import('./person.js'),
            view: ctx =>
                html`<test-person person-id="${ctx.params.id}"></test-person>`,
        },
    ];
}
