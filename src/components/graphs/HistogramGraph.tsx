import { connect } from 'react-redux';
import * as React from 'react';

import { RenderType } from './types';

// Properties
export type GraphProps = {
  renderType: RenderType,
}

class GraphBase extends React.PureComponent<GraphProps> {
  render() {
    switch (this.props.renderType) {
      default:
        return "Histogram graph not implemented yet for " + RenderType[this.props.renderType];
    }
  }
}

const mapStateToProps = ({ graph }): Partial<GraphProps> => ({
  renderType: graph.renderType
});

export const Graph = connect(mapStateToProps)(GraphBase);