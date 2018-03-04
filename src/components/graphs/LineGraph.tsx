import { connect } from 'react-redux';
import * as React from 'react';

import { RenderType } from './types';

// Properties
type Data = [number, number][];
export type GraphProps = {
  data: Data,
}
export type GraphContainerProps = {
  renderType: RenderType,
}

const data: Data = [
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

import { AxisLeft, AxisBottom } from '@vx/axis';
import { curveNatural } from '@vx/curve';
import { Grid } from '@vx/grid';
import { Group } from '@vx/group';
import { LinePath } from '@vx/shape';
import { scaleLinear } from '@vx/scale';

const height = 400;
const width = 750;
const margin = {
  top: 60,
  bottom: 60,
  left: 80,
  right: 80,
};
// x is the first data element, y the second
const x = d => d[0];
const y = d => d[1];
const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;
const xScale = scaleLinear({
  range: [0, xMax],
  domain: [0, 1000],
});
const yScale = scaleLinear({
  range: [yMax, 0],
  domain: [300, 750],
});

class VXGraph extends React.PureComponent<GraphProps> {
  render() {
    return (
      <svg viewBox={`0 0 ${width} ${height}`}>
        <Group top={margin.top} left={margin.left}>
          <AxisBottom
            scale={xScale}
            top={yMax}
            label={'Distance from Surface (µm)'}
          />
          <AxisLeft
            scale={yScale}
            top={0}
            left={0}
            label={'Hardness (Vickers)'}
          />
          <Grid
            xScale={xScale}
            yScale={yScale}
            width={xMax}
            height={yMax}
          />
          <LinePath
            curve={curveNatural}
            data={this.props.data}
            x={x} xScale={xScale}
            y={y} yScale={yScale}
          />
        </Group>
      </svg>
    );
  }
}

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