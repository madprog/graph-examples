import { connect } from 'react-redux';
import * as React from 'react';

import { DataItem, RenderType } from './types';
import { Graph as VXGraph } from './vx/LineGraph';

// Properties
export type GraphProps = {
  data: DataItem[],
}
export type GraphContainerProps = {
  renderType: RenderType,
}

const data: DataItem[] = [
  { id: "1",  distanceToAnchor: 50,   hardness: 725 },
  { id: "2",  distanceToAnchor: 100,  hardness: 710 },
  { id: "3",  distanceToAnchor: 200,  hardness: 680 },
  { id: "4",  distanceToAnchor: 300,  hardness: 640 },
  { id: "5",  distanceToAnchor: 400,  hardness: 595 },
  { id: "6",  distanceToAnchor: 500,  hardness: 575 },
  { id: "7",  distanceToAnchor: 600,  hardness: 550 },
  { id: "8",  distanceToAnchor: 700,  hardness: 500 },
  { id: "9",  distanceToAnchor: 800,  hardness: 450 },
  { id: "10", distanceToAnchor: 900,  hardness: 420 },
  { id: "11", distanceToAnchor: 1000, hardness: 420 },
];

class GraphBase extends React.PureComponent<GraphContainerProps> {
  render() {
    switch (this.props.renderType) {
      case RenderType.VX:
        return <VXGraph data={data} />;
      default:
        return "Line graph not implemented yet for " + RenderType[this.props.renderType];
    }
  }
}

const mapStateToProps = ({ graph }): Partial<GraphContainerProps> => ({
  renderType: graph.renderType
});

export const Graph = connect(mapStateToProps)(GraphBase);