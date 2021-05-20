# Router

A lit-element wrapper around Page.js.

The aim of this library is to provide an easy way to define routes, lazy load the view, and update to changes in the route. 

## Route Loading and Registration
```js
registerRoutes([
    {
        pattern: '/example',
        loader: () => import('./home.js'),
        view: () => html`<test-home></test-home>`
    },
    peopleRouteLoader,
    placesRouteLoader,
    {
        pattern: '*',
        view: (ctx) => html`<h1>Not Found ${ctx.pathName}</h1>`
    },
], options // the router configurations);
```

This is the first step. Registering routes builds the routing tree that the application uses to determine which view to show at the entry-point. A routes view is a function that returns a lit-html template. This template gets rendered into your applications entry-point when the url matches the pattern.

The view is also passed a page context object 

## RouteReactor
The RouteReactor is an early Reactive Controller that updates an element when the current route changes.

```js
class EntryPoint extends LitElement {
    constructor() {
        super();
        this.route = RouteReactor(this);
    }

    render() {
        return this.route.view;
    }
}
```

It can also be used by a component that needs to listen to changes to the url.

```js
class FooBar extends LitElement {
    constructor() {
        super();
        this.route = RouteReactor(this);
    }

    render() {
        let userId = this.route.params.userId;
        let orgId = this.route.search.get('org-unit');

        return html`<span> user: ${userId} orgUnit: ${orgId}</span>`;
    }
}
```

## Contributing

### Running

```bash
npm i
npm run start 
```

### Testing

```bash
npm test
```

The repo is based on the @open-wc template and comes with husky. Testing will run each time you commit. Failed tests may keep you from pushing. Prettier is also used to format the code. You may need to run 

```
npx run prettier:write
```

to silence any Prettier related errors. Husky runs the above command on commit so it is probably unnecessary. 

For testing page routing in your application we recommend using this template.

```js
describe('Page Routing', () => {
    beforeEach(async () => {
        initRouter(); // Either initialize your routes here or import a file that calls routeRegister and make a way to recall it.
        entryPoint = await fixture(html`<!-- Your ViewReactor component here -->`);
        redirect('/'); // Reset tests back to the index, clears the url
    });

    afterEach(() => {
        RouterTesting.reset(); // creates a new router instance, clears any router related reactive controllers.
    });

    // Your tests here
});
```

## Helpers

### Redirecting

Page.js will hook into any `<a>` tags and run the redirect but if you want to redirect in javascript you can use.

```js
import { redirect } from '@brightspace-ui-labs/router';

redirect('/');
```

## Options

Options are the second parameter in the registerRoutes functions. The two tables below encompasses all of the attributes that the options object can use.

The configurable page.js options are   

| Name                |                               Description                               | Default |
| :------------------ | :---------------------------------------------------------------------: | ------: |
| click               |                          bind to click events                           |    true |
| popstate            |                            bind to popstate                             |    true |
| dispatch            |                        perform initial dispatch                         |    true |
| hashbang            |                           add #! before urls                            |   false |
| decodeURLComponents | remove URL encoding from path components (query string, pathname, hash) |    true |


With the addition of

| Name       |                      Description                      | Default |
| :--------- | :---------------------------------------------------: | ------: |
| basePath   |       the path all other paths are appended too       |     '/' |
| customPage | don't use the global page object (useful for testing) |   false |


