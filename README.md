# Router

A lit-element wrapper around Page.js. 

## Running

```bash
npm i
npm run start 
```

This will run the demo and the components in examples/components.js

## Components

### d2l-router
The router must exist in your application. It also needs to be a parent of the route components but it doesn't need to be a direct parent.

The base path is placed at the begining of all the paths routes.
```html 
<d2l-router base-path="/d2l">
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