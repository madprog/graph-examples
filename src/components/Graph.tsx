import * as React from 'react';
import Paper from 'material-ui/Paper'
import { WithStyles, withStyles } from 'material-ui/styles';
import { defineMessages } from 'react-intl';

// Localizable strings
const messages = defineMessages({
});

// Styles
const styles = {
  root: {
    backgroundColor: 'red',
  },
} as React.CSSProperties;

// Properties
export type GraphProps = WithStyles<'root'> & {
}

// Main presentation component: without styles
export class GraphBase extends React.PureComponent<GraphProps> {
  render() {
    return (
      <Paper elevation={4}>
      </Paper>
    );
  }
}

// Applies the specified styles
export const Graph = withStyles(styles, { name: 'Graph' })(GraphBase);
