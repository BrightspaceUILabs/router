# Router

A Lit wrapper around Page.js.

The aim of this library is to provide an easy way to define routes, lazy load the view, and update to changes in the route.

> Note: this is a ["labs" component](https://daylight.d2l.dev/developing/getting-started/component-tiers/). While functional, these tasks are prerequisites to promotion to BrightspaceUI "official" status:
>
> - [ ] [Design organization buy-in](https://daylight.d2l.dev/developing/creating-component/before-building/#working-with-design)
> - [ ] [Architectural sign-off](https://daylight.d2l.dev/developing/creating-component/before-building/#web-component-architecture)
> - [ ] [Continuous integration](https://daylight.d2l.dev/developing/testing/tools/#continuous-integration)
> - [ ] [Cross-browser testing](https://daylight.d2l.dev/developing/testing/cross-browser/)
> - [ ] [Unit tests](https://daylight.d2l.dev/developing/testing/tools/) (if applicable)
> - [ ] [Accessibility tests](https://daylight.d2l.dev/developing/testing/accessibility/)
> - [ ] [Visual diff tests](https://daylight.d2l.dev/developing/testing/visual-difference/)
> - [ ] Localization with Serge (if applicable)
> - [x] Demo page
> - [ ] README documentation

## Route Loading and Registration
```js
registerRoutes([
    {
        pattern: '/example',
        loader: () => import('./home.js'),
        view: () => html`<test-home></test-home>`
    },
    {
        pattern: '/example/:id',
        view: ctx => html`<test-id id=${ctx.params.id}></test-id>`
    },
    {
        pattern: '/example/foo/:bar',
        view: (ctx) => html`
            <test-foo bar=${ctx.params.bar}>
                ${ctx.search.name}
            </test-foo>`
    }
    {
        pattern: '*',
        view: () => html`<h1>Not Found</h1>`
    },
], options // the router configurations);
```

This is the first step. Registering routes builds the routing tree that the application uses to determine which view to show at the entry-point. A routes view is a function that returns a lit-html template. This template gets rendered into your applications entry-point when the url matches the pattern.

### Route options

Each route must be registered as an object with these properties:
- pattern (required): The Page.js route pattern on which to match
- loader (optional): Initial loading to perform before rendering the view; must return a Promise
- view (optional): Function that returns a lit-html template to render
- to (optional): String indicating a redirect path, using Page.js `redirect(fromPath, toPath)`

### View context

The view is given a context object that contains:
 - params: The URL parameters.
 - search: The Search Query values.
 - options: An object passed by the entry-point. It is an empty object if given nothing.
 - path: Pathname and query string "/login?foo=bar" from Page.js.
 - pathname: The pathname void of query string "/login" from Page.js.
 - hash: The url hash "#hash=values".
 - route: The route pattern given to the view in the router.
 - title: The title in the push state.

```js
pattern: '/user/:id/:page' // search: ?semester=1
view: ctx => html`
    <user-view
        id=${ctx.options.id}
        page=${ctx.params.page}
        semester=${ctx.search.semester}>
    </user-view>`
```

### Multiple Route Loaders

If that application you are building has many sub application it may be beneficial to organize your source folder like so.

```
/src
| /components
|
| /app1
| | app1-view.js
| | route-loader.js
|
| /app2
| | app2-view.js
| | route-loader.js
|
| entry-point.js
| route-loader.js
```

The main route-loader in the root of the src folder should import the route-loader files in the subdirectories that separate the apps pages. It should look something like this.

```js
/* src/route-loader.js */
import { loader as app1Loader } from './app1/route-loader.js';
import { loader as app2Loader } from './app2/route-loader.js';
import { registerRoute } from '@brightspaceui-labs/router.js';

registerRoute([
    {
        pattern: '/',
        view: () => html`<entry-point></entry-point>`
    },
    app1Loader,
    app2Loader
])

/* src/page1/route-loader.js */
export const loader () => [
    {
        pattern: '/app1',
        loader: () => import('./app1-view.js'),
        view: () => html`<app-1></app-1>`
    }
]
```

Route-loaders can be nested as far as you would like. You could have a folder path `/src/user/settings/profile/password` and have route-loaders at each point that import the next route-loader one level above. Therefore,

`/user/route-loader.js` could import and register
`/user/settings/route-loader.js` which in turn imports and registers
`/user/settings/profile/route-loaders.js`.

and on and on...


## RouteReactor
The RouteReactor is an early Reactive Controller that updates an element when the current route changes.

```js
class EntryPoint extends LitElement {
    constructor() {
        super();
        this.route = RouteReactor(this);
    }

    render() {
        const options = { /* Options for the views. Can be used for attributes */};
        return this.route.renderView(options);
    }
}
```

It can also be used by a component that needs to listen to changes to the url. The available properties are the same as the context object passed to the views above with the addition of `renderView()`.

```js
class FooBar extends LitElement {
    constructor() {
        super();
        this.route = RouteReactor(this);
    }

    render() {
        let userId = this.route.params.userId;
        let orgId = this.route.search['org-unit'];

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
        navigate('/'); // Reset tests back to the index, clears the url
    });

    afterEach(() => {
        RouterTesting.reset(); // creates a new router instance, clears any router related reactive controllers.
    });

    // Your tests here
});
```

### Versioning and Releasing

This repo is configured to use `semantic-release`. Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`.

To learn how to create major releases and release from maintenance branches, refer to the [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) documentation.

## Helpers

### Navigating and Redirecting

Page.js will hook into any `<a>` tags and handle the navigation but if you want to navigate in javascript you can use `navigate(path)`:

```js
import { navigate } from '@brightspace-ui-labs/router';

navigate('/');
```

If you wish to programmatically redirect to a page and have the previous history item be replaced with the new one, you can use `redirect(path)`:

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


