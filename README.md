A backup of router V1

# Router

A lit-element wrapper around Page.js. 

```html
<d2l-router base-path="/">
    <d2l-route path="/">
        <!-- Insert view -->
    </d2l-route>

    <d2l-route path="/foo">
        <!-- Insert View -->
    </d2l-route>

    <d2l-route path="/bar/:barParam">
        <!-- Insert View -->
    </d2l-route>
</d2l-router>
```

## Contributing

### Running

```bash
npm i
npm run start 
```

This will run the demo and the components in examples/components.js

### Testing

```bash
npm test
```

The repo is based on the @open-wc template and comes with husky. Testing will run each time you commit. Failed tests may keep you from pushing. Prettier is also used to format the code. You may need to run 

```
npm run prettier:write
```

to silence any Prettier related errors. Husky runs the above command on commit so it is probably unnecessary. 

## Components

### d2l-router
The router must exist in your application. It also needs to be a parent of the route components but it doesn't need to be a direct parent.

The base path is placed at the beginning of all the paths routes.

The options are used to configure Page.js.
```html 
<d2l-router 
    base-path="/d2l"
    options="${{
        click: true,
        popstate: true,
        dispatch: true,
        hashbang: false,
        decodeURLComponents: true
    }}">
    <!-- Insert routes here -->
</d2l-router>
```

### d2l-route
The route element will draw it's children when the url matches the pattern.
```html 
<d2l-route path="/content">
    <span>I will draw at /d2l/content</span>
</d2l-route>
```
Page.js supports lots of patterns so check out their documentation https://visionmedia.github.io/page.js/

## Mixins

### RouterContextConsumer
The router context consumer will update whenever the current page's context changes and set the components `ctx` property.

### RouterParamConsumer
The router params consumer will update whenever the current page's url parameters change and will set the components `params` property.

### RouterSearchQueryConsumer
The router params consumer will update whenever the current page's search query change and will set the components `query` property as a URLSearchParams object.

## Context Observing

You can write your own components that attach to the observable context by calling `router.observeContext(callback)` with a callback that updates the components properties. Look at the existing mixins for examples.


## Page.js
Read over the page.js documentation to make sure it's behavior doesn't conflict with your applications. Page uses the [History Api](https://developer.mozilla.org/en-US/docs/Web/API/History_API) which will require that the server responds to all sub paths of your applications route with the same response.

## Page.js Extensions

This project adds a few new functions to page js to make it easier to use with lit.

### setSearchQuery(key, value)

Will replace a search query with a new value and go to the new page updating any components using the Context or SearchQuery consumers.