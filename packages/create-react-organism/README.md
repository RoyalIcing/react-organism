# create-react-organism

Easily create [react-organism](https://github.com/RoyalIcing/react-organism) smart components.

## Usage

```sh
yarn create react-organism CustomName

# or

npm i -g create-react-organism
create-react-organism CustomName
```

This creates a directory for your organism at: **[/src]/organisms/CustomName**

Creates an **organisms** folder in your project, and a folder for your organism inside there.

Three files are created:
- **[CustomName].js:** a pure React component that renders the given state as props, as well as call action handlers defined in **state.js**
- **state.js:** a list of exported functions that handle the progression of state, from its `initial` form, to `load` data in asynchronously, to other action handlers that are called in response to events (e.g. onClick, onChange, etc).
- **index.js:** connects the pure component and state together and exports it for easy use.
