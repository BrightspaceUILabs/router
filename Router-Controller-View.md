# Route Controller View Pattern

## Definitions

### Route

The route is a path that leads to a controller. 

### Controller

A controller is a function that dictates the behavior of the route.

### View

A view may be returned by a controller to draw the current template to the browser.

## Proposal

### Controller

```javascript

const controller = new Controller();

controller.register([
    {
        pattern: '/',
        view: () => html``
    }
])

```

### ViewReactor

```javascript

class EntryPoint extends LitElement {

    constructor() {
        this.view = new ViewReactor(this); // reactive controller
    }

    render() {
        return this.view.activeView;
    }

} 

```

### RouteReactor

```javascript

class RouteListener extends LitElement {

    constructor() {
        this.route = new RouteReactor(this); // reactive controller
    }

    render() {
        return html`<p> ${this.route.params.id} ${this.route.search.orgFilter}</p>`
    }

} 

// in the backend this registers a new middleware for listening to context changes

constructor(host) {
    RouteController.hosts.push(host);

    if (RouteController.firstConstruction) {
        page('*', (context) => {
            RouteController.hosts.forEach(host => {
                host.requestUpdate();
            })
        })
        RouteController.firstConstruction = false;
    }
}



```