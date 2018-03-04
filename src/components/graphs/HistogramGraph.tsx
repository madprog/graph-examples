import { connect } from 'react-redux';
import * as React from 'react';

import { DataItem, RenderType } from './types';
import { Graph as VXGraph } from './vx/HistogramGraph';
import { largeData as data } from './data';

// Properties
export type GraphProps = {
  data: DataItem[],
}
export type GraphContainerProps = {
  renderType: RenderType,
}

class GraphBase extends React.PureComponent<GraphContainerProps> {
  render() {
    switch (this.props.renderType) {
      case RenderType.VX:
        return <VXGraph data={data} nbBins={20} />;
      default:
        return "Histogram graph not implemented yet for " + RenderType[this.props.renderType];
    }
  }
}

const mapStateToProps = ({ graph }): Partial<GraphContainerProps> => ({
  renderType: graph.renderType
});

export const Graph = connect(mapStateToProps)(GraphBase);