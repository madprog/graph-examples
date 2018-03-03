import { connect } from 'react-redux';
import * as React from 'react';

import { RenderType } from './types';

// Properties
export type GraphProps = {
  renderType: RenderType,
}

const data: [number, number][] = [
  [50, 725],
  [100, 710],
  [200, 680],
  [300, 640],
  [400, 595],
  [500, 575],
  [600, 550],
  [700, 500],
  [800, 450],
  [900, 420],
  [1000, 420],
];

class GraphBase extends React.PureComponent<GraphProps> {
  render() {
    switch (this.props.renderType) {
      default:
        return "Line graph not implemented yet for " + RenderType[this.props.renderType];
    }
  }
}

const mapStateToProps = ({ graph }): Partial<GraphProps> => ({
  renderType: graph.renderType
});

export const Graph = connect(mapStateToProps)(GraphBase);