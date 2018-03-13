import { connect } from 'react-redux';
import * as React from 'react';

import { DataItem, RenderType } from './types';
import { Graph as VXGraph } from './vx/HeatMapGraph';
import { fullData as data } from './data';

// Properties
export type GraphProps = {
  data: DataItem[],
}
export type GraphContainerProps = {
  renderType: RenderType,
}

const polygon = [
  [1.00000000, 0.532860],
  [0.94427713, 0.000000],
  [0.88972833, 0.006800],
  [0.83778163, 0.235687],
  [0.75588173, 0.260707],
  [0.58315285, 0.100090],
  [0.49050365, 0.149540],
  [0.53396285, 0.378957],
  [0.46937915, 0.431337],
  [0.24885899, 0.345417],
  [0.18223819, 0.424757],
  [0.30992482, 0.621319],
  [0.26967142, 0.694159],
  [0.03182917, 0.697359],
  [0.00000000, 0.797991],
  [0.19373050, 0.935202],
  [0.18818413, 0.978094],
  [0.40506528, 1.000000],
];

class GraphBase extends React.PureComponent<GraphContainerProps> {
  render() {
    switch (this.props.renderType) {
      case RenderType.VX:
        return <VXGraph data={data} nbBinsX={200} nbBinsY={200} polygon={polygon} />;
      default:
        return "HeatMap graph not implemented yet for " + RenderType[this.props.renderType];
    }
  }
}

const mapStateToProps = ({ graph }): Partial<GraphContainerProps> => ({
  renderType: graph.renderType
});

export const Graph = connect(mapStateToProps)(GraphBase);