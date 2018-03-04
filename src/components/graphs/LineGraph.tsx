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
  { id: "1",  x: 50,   y: 725 },
  { id: "2",  x: 100,  y: 710 },
  { id: "3",  x: 200,  y: 680 },
  { id: "4",  x: 300,  y: 640 },
  { id: "5",  x: 400,  y: 595 },
  { id: "6",  x: 500,  y: 575 },
  { id: "7",  x: 600,  y: 550 },
  { id: "8",  x: 700,  y: 500 },
  { id: "9",  x: 800,  y: 450 },
  { id: "10", x: 900,  y: 420 },
  { id: "11", x: 1000, y: 420 },
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