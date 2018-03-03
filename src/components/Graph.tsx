import * as React from 'react';
import Paper from 'material-ui/Paper'
import { WithStyles, withStyles } from 'material-ui/styles';
import { defineMessages } from 'react-intl';
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';

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
  graphElement: React.ReactType<any>,
  graphType: string,
  graphTypes: [string, string][],
  handleChangeGraphType: (event: React.ChangeEvent<{}>, value: any) => void | undefined,
}

// Main presentation component: without styles
export class GraphBase extends React.PureComponent<GraphProps> {
  render() {
    const {
      graphElement,
      graphType,
      graphTypes,
      handleChangeGraphType,
     } = this.props;
    return [
      <Tabs
        key="graphTypes"
        fullWidth
        onChange={handleChangeGraphType}
        value={graphType}
      >
        {graphTypes.map(([value, label]) => (
          <Tab
            key={value}
            label={label}
            value={value}
          />
        ))}
      </Tabs>,
      <Paper key="graph" elevation={4}>
        {graphElement && React.createElement(graphElement)}
      </Paper>
    ];
  }
}

// Applies the specified styles
export const Graph = withStyles(styles, { name: 'Graph' })(GraphBase);
