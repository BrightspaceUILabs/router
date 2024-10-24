# @brightspace-ui-labs/lit-router

A Lit wrapper around the [Page.js Router](https://visionmedia.github.io/page.js/).

The aim of this library is to provide an easy way to define routes, lazy load the view, and react to changes to the route.

## Installation

Install from NPM:

```shell
npm install @brightspace-ui-labs/lit-router
```

## Usage

### Route Registration

Registering routes defines the routing table used when determining the view to render.

When the URL matches a particular route's pattern, the `view` function is called and returns a Lit `html` literal to render.

```js
import { registerRoutes } from '@brightspace-ui-labs/lit-router';

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
    view: ctx => html`
      <test-foo bar=${ctx.params.bar}>
        ${ctx.search.name}
      </test-foo>
    `
  }
], options);
```

#### Route Properties

Each route has the following properties:
- `pattern` (required): The Page.js route pattern on which to match
- `loader` (optional): Allows for lazy-loading dependencies (e.g. importing view files) before rendering the view; must return a Promise
- `view` (optional): Function that returns a Lit `html` literal to render
- `to` (optional): String indicating a redirect path, using Page.js `redirect(fromPath, toPath)`

#### View Context

The view is provided a context object containing:
 - `params`: URL segment parameters (e.g. `:id`)
 - `search`: search query values
 - `options`: object passed by the entry-point
 - `path`: Pathname and query string (e.g. `"/login?foo=bar"`)
 - `pathname`: Pathname void of query string (e.g. `"/login"`)
 - `hash`: URL hash (e.g. `"#hash=values"`)
 - `route`: route pattern given to the view in the router
 - `title`: title in the push state

Example:
```js
{
  pattern: '/user/:id/:page' // search: ?semester=1
  view: ctx => html`
    <user-view
        id=${ctx.options.id}
        page=${ctx.params.page}
        semester=${ctx.search.semester}>
    </user-view>
  `
}
```

#### Options

Options are the second parameter passed to `registerRoutes`. The two tables below encompasses all of the attributes that the options object can use.

Page.js options:

| Name                |                               Description                               | Default |
| :------------------ | :---------------------------------------------------------------------: | ------: |
| click               |                          bind to click events                           |    true |
| popstate            |                            bind to popstate                             |    true |
| dispatch            |                        perform initial dispatch                         |    true |
| hashbang            |                           add #! before urls                            |   false |
| decodeURLComponents | remove URL encoding from path components (query string, pathname, hash) |    true |

Additional options:

| Name       |                      Description                      | Default |
| :--------- | :---------------------------------------------------: | ------: |
| basePath   |       the path all other paths are appended too       |     '/' |
| customPage | don't use the global page object (useful for testing) |   false |

### Multiple Route Loaders

Some complex applications have many sub applications, and in these scenarios it may be beneficial to delegate to multiple route loaders.

Example directory structure:
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

The main route-loader in the root of the `src` directory should import the route-loader files in the subdirectories.

```js
/* src/route-loader.js */
import { loader as app1Loader } from './app1/route-loader.js';
import { loader as app2Loader } from './app2/route-loader.js';
import { registerRoutes } from '@brightspace-ui-labs/lit-router';

registerRoutes([
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

### RouteReactor

The `RouteReactor` is a [Reactive Controller](https://lit.dev/docs/composition/controllers/) responsible for re-rendering the nested view when the route changes.

```js
import { RouteReactor } from '@brightspace-ui-labs/lit-router';

class EntryPoint extends LitElement {

  constructor() {
    super();
    this.route = new RouteReactor(this);
  }

  render() {
    // Options for the views. Can be used for attributes */
    const options = { };
    return this.route.renderView(options);
  }

}
```

A `RouteReactor` can also be used to react to changes to the URL. The available properties are the same as the context object passed to the views above.

```js
import { RouteReactor } from '@brightspace-ui-labs/lit-router';

class FooBar extends LitElement {

  constructor() {
    super();
    this.route = new RouteReactor(this);
  }

  render() {
    const userId = this.route.params.userId;
    const orgId = this.route.search['org-unit'];
    return html`<span> user: ${userId} orgUnit: ${orgId}</span>`;
  }

}
```

### Helpers

#### Navigating and Redirecting

Page.js will hook into any `<a>` tags and handle the navigation automatically. However, to navigate manually use `navigate(path)`:

```js
import { navigate } from '@brightspace-ui-labs/lit-router';

navigate('/');
```

To programmatically redirect to a page and have the previous history item be replaced with the new one, use `redirect(path)`:

```js
import { redirect } from '@brightspace-ui-labs/lit-router';

redirect('/');
```

### Testing Routing in Your Application

For testing page routing in your application, this template is recommended:

```js
describe('Page Routing', () => {

  beforeEach(async () => {
    // Initialize the routes here or import a file
    // that calls registerRoutes and expose a way to recall it
    initRouter();
    entryPoint = await fixture(html`<!-- Your ViewReactor component here -->`);
    navigate('/'); // Reset tests back to the index, clears the url
  });

  afterEach(() => {
    RouterTesting.reset(); // creates a new router instance, clears any router related reactive controllers.
  });

  // Your tests here

});
```

## Known Issues

### Route order inversion issue

There's currently an issue with the way registered routes are processed that can cause the order of matching to appear to be inverted. This is not noticeable in many cases since it's often the case that only a single route will match regardless of the order. This does however come up when dealing with wildcard (`*`) routes (e.g. 404 redirect routes).

If you notice that you have to put any routes with wildcards (`*`) before those without instead of after, this is the reason why.

#### Issue Fix

There is currently a fix available for this ordering issue, but it requires setting the `enableRouteOrderFix` option to `true`. Ex:

```js
registerRoutes([
  {
    pattern: '/home',
    view: () => html`...`
  },
  {
    pattern: '/404',
    view: () => html`...`
  },
  {
    pattern: '*',
    to: '/404'
  }
], {
  enableRouteOrderFix: true
});
```

Note: The reason this is an opt-in fix is that a lot of existing implementations of lit-router have worked around this issue by putting the wildcard routes at the start, which would break if the issue were fixed for everyone automatically.

## Developing and Contributing

After cloning the repo, run `npm install` to install dependencies.

### Testing

To run the full suite of tests:

```shell
npm test
```

Alternatively, tests can be selectively run:

```shell
# eslint
npm run lint

# unit tests
npm run test:unit
```

### Running the demos

To start a [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) that hosts the demo pages and tests:

```shell
npm start
```

### Versioning and Releasing

This repo is configured to use `semantic-release`. Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `main`.

To learn how to create major releases and release from maintenance branches, refer to the [semantic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/main/semantic-release) documentation.
