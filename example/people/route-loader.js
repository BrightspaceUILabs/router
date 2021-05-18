import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

export function loader(router) {
    return [
        {
            pattern: '/example/people',
            loader: () => import('./people.js'),
            view: context => html` <test-people
                @filter-change="${e =>
                    router.redirect(
                        `/example/people?filter=${e.detail.value}`
                    )}"
                filter="${ifDefined(context.searchParams.filter)}"
            ></test-people>`,
        },
        {
            pattern: '/example/people/:id',
            loader: () => import('./person.js'),
            view: context =>
                html`<test-person
                    person-id="${context.params.id}"
                ></test-person>`,
        },
    ];
}
