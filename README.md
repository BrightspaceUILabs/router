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
        view: () => html`<h1>Not Found</h1>`
    },
], options // the router configurations);
```

This is the first step. Registering routes builds the routing tree that the application uses to determine which view to show at the entry-point.

## Displaying the Active View
The ViewReactor is an early Reactive Controller that updates an element when the current routes view changes.

```js
class EntryPoint extends LitElement {
    constructor() {
        super();
        this.viewReactor = ViewReactor(this);
    }

    render() {
        return this.viewReactor.view;
    }
}
```

## Reacting to Route Changes
The RouteReactor is used to update a component when there are changes to the path, search, or url parameters of a route.

```js
class EntryPoint extends LitElement {
    constructor() {
        super();
        this.routeReactor = RouteReactor(this);
    }

    render() {
        let userId = this.routeReactor.params.userId;
        let orgId = this.routeReactor.get('org-unit')
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

## Helpers

### Redirecting

Page.js will hook into any `<a>` tags and run the redirect but if you want to redirect in javascript you can use.

```js
import { redirect } from '@brightspace-ui-labs/router';

redirect('/');
```

### Testing

`resetForTesting` can be used to stop, and restart a new Page.js instance. This is useful for tests that may reuse routes.

```js
beforeEach(() => resetForTesting());
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


