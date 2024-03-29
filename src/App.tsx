import * as React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { IntlProvider } from 'react-intl';
import { createLogger } from 'redux-logger';
import { GraphContainer, graphReducer } from './components/GraphContainer';
import { MainPage } from './components/MainPage';
import { LabeledButton, Text } from './components/shared';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { createMuiTheme, Theme } from 'material-ui/styles';
import { composeWithDevTools } from 'redux-devtools-extension';

// Combine the reducers
const rootReducer = combineReducers({
    // A specific reducer for our graph
    graph: graphReducer,

    // Used for redux form
    // you have to pass formReducer under 'form' key,
    // for custom keys look up the docs for 'getFormState'
    form: formReducer,
  })

// Set overrides of Material UI components
const themeOverrides = {
  MuiPaper: {
    root: {
      padding: '10px'
    }
  }
}

// Create themes:
const lightTheme = createMuiTheme({
  palette: { type: 'light' },
  overrides: themeOverrides,
});

const darkTheme = createMuiTheme({
  palette: { type: 'dark' },
  overrides: themeOverrides,
});

// Creates a logger component
// https://www.npmjs.com/package/redux-logger
const logger = createLogger({
  // ...options
});

// Apply the redux middleware
// https://redux.js.org/docs/advanced/Middleware.html
const middleware = applyMiddleware(
  // logger must be the last middleware in chain, otherwise it will log thunk and promise, not actual actions
  logger
);

// Create a store with the combined reducers and middleware
const store = createStore(rootReducer, composeWithDevTools(middleware));

// The main application
export type AppProperties = { }

// Theme information is stored in app state. Optionally this could have been added
// as its own reducer, but it would have added a lot of additional complexity for a simple string value
// This is the simplest thing that could have worked
export type AppState = { theme: Theme };

// The main application component, which stores theme information in a local state object.
export class App extends React.PureComponent<AppProperties, AppState>
{
  state: AppState = { theme: lightTheme }
  setLightTheme() { this.setState({ theme: lightTheme }); }
  setDarkTheme() { this.setState({ theme: darkTheme }); }
  render(): React.ReactNode
  {
    const header = (<Text variant="display2">Welcome to my first TypeScript React/Redux Application</Text>);

    const sidebar = (
      <List component="nav">
        <ListItem button>
          <ListItemText primary="Entry 1" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Entry 2" />
        </ListItem>
        <ListItem button onClick={e => this.setLightTheme()}>
          <ListItemText primary="light"/>
        </ListItem>
        <ListItem button onClick={e => this.setDarkTheme()}>
          <ListItemText primary="dark"/>
        </ListItem>
      </List>
    );

    const content = (<GraphContainer/>);

    return (
      <Provider store={store}>
        <IntlProvider locale="en">
          <MuiThemeProvider theme={this.state.theme}>
            <MainPage
              header={header}
              sidebar={sidebar}
              content={content}
            />
          </MuiThemeProvider>
        </IntlProvider>
      </Provider>
    );
  }
}
