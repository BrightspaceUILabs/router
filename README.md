# Router

A lit-element wrapper around Page.js. 

```js
// Route Loader Array
[
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
];
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

## Usage

Your applications entry point will need to create and initialize the router. Routes must be loaded all at once otherwise the router won't know which view to show.

The entry point should look like this

```js
// app.js
import {routeLoader} from './route-loader.js';

class App extends LitElement {
    constructor() {
		super();
		this.router = new Router(this, routeLoader);
    }
    
    render() {
        return this.router.view;
    }
}
```

The route loader is responsible for declaring all of the routes your application will use. You can declare multiple route loaders as long as they are imported by the main one used in you app entry-point.

```js
// route-loader.js
export function loader(router) {
	return [
		{
            // the route that will show this template.
            pattern: '/example',
            // any additional dependencies it may require.
            loader: () => import('./home.js'),
            // the template to be rendered.
			view: () => html`<test-home></test-home>` 
		},
		peopleRouteLoader,
		placesRouteLoader,
		{
			pattern: '*',
			view: () => html`<h1>Not Found</h1>`
		},
	];
}
```

The router parameter passed to the loader can be used for redirects. 

## Options

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

 
