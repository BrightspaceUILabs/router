import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
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
