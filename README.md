# Logica11y
NOTE: This is very much a work in progress and should not be used yet.
Automated widget validation according the the ARIA Authoring Practices.  Validates attributes (initial and dynamic) as well as keyboard interaction.

## Usage

### In the browser
```js
const logica11y = window.logica11y;

logica11y.tabs({
  tabs: '.tab'
}).then((result) => {
  console.log(result); // { valid: false, failures: [...], passes: [...] }
}).catch((err) => console.log(err));
```

### Browserify
```js
const logica11y = require('logica11y');

logica11y.tabs({
  tabs: '.tab'
}).then((result) => {
  console.log(result); // { valid: false, failures: [...], passes: [...] }
}).catch((err) => console.log(err));
```

## API

### logica11y.tabs
The tabs API returns a promise and accepts an options object:
- `tabs` {_Mixed_}: A selector for all tabs OR an array (or nodeList) of tab elements
- `timeout` {_Number_}: Time in ms it takes for panel to display upon tab activation (defaults to 0)
