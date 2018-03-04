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
import { bisector } from 'd3-array';
import { curveNatural } from '@vx/curve';
import { Grid } from '@vx/grid';
import { Group } from '@vx/group';
import { Line, LinePath } from '@vx/shape';
import { localPoint } from '@vx/event';
import { scaleLinear } from '@vx/scale';
import { Text } from '@vx/text';
import { Tooltip, withTooltip } from '@vx/tooltip';

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

type VXGraphProps = GraphProps & {
  handleHideToolTip: (data: Data) => ((event: any) => void),
  handleShowToolTip: (data: Data) => ((event: any) => void),
  tooltipData: Data,
  tooltipLeft: number,
  tooltipTop: number,
};

class VXGraphBase extends React.PureComponent<VXGraphProps> {
  render() {
    const {
      data,
      handleHideToolTip,
      handleShowToolTip,
      tooltipData,
      tooltipLeft,
      tooltipTop,
    } = this.props;
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
            data={data}
            x={x} xScale={xScale}
            y={y} yScale={yScale}
          />
          <LinePath
            curve={curveNatural}
            data={data}
            x={x} xScale={xScale}
            y={y} yScale={yScale}
            strokeWidth={20}
            stroke="transparent"
            onTouchStart={handleShowToolTip}
            onTouchMove={handleShowToolTip}
            onMouseMove={handleShowToolTip}
            onMouseLeave={handleHideToolTip}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: yMax }}
                to={{ x: tooltipLeft, y: tooltipTop }}
                stroke="rgba(92, 119, 235, 1.000)"
                strokeWidth={2}
                style={{pointerEvents: 'none'}}
                strokeDasharray="2,2"
              />
              <Line
                from={{ x: 0, y: tooltipTop }}
                to={{ x: tooltipLeft, y: tooltipTop }}
                stroke="rgba(92, 119, 235, 1.000)"
                strokeWidth={2}
                style={{pointerEvents: 'none'}}
                strokeDasharray="2,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill="rgba(92, 119, 235, 1.000)"
                stroke="white"
                strokeWidth={2}
                style={{ pointerEvents: 'none' }}
              />
              <Text x={tooltipLeft} y={yMax}>{tooltipData[0]}</Text>
              <Text x={0} y={tooltipTop}>{tooltipData[1]}</Text>
            </g>
          )}
        </Group>
      </svg>
    );
  }
}

const VXGraph = withTooltip(connect(
  () => ({ data }),
  (dispatch, ownProps: { hideTooltip: any, showTooltip: any }): Partial<VXGraphProps> => ({
    handleHideToolTip: (data: Data) => (event: any) => ownProps.hideTooltip(),
    handleShowToolTip: (data: Data) => (event: any) => {
      const { x } = localPoint(event);
      const x0 = xScale.invert(x - margin.left);
      const index = bisector(d => d[0]).left(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;
      if (d1 && d1[0]) {
        d = x0 - d0[0] > d1[0] - x0 ? d1 : d0;
      }
      ownProps.showTooltip({
        tooltipData: d,
        tooltipLeft: xScale(d[0]),
        tooltipTop: yScale(d[1]),
      })
    },
  }),
)(VXGraphBase));

class GraphBase extends React.PureComponent<GraphContainerProps> {
  render() {
    switch (this.props.renderType) {
      case RenderType.VX:
        return <VXGraph />;
      default:
        return "Line graph not implemented yet for " + RenderType[this.props.renderType];
    }
  }
}

const mapStateToProps = ({ graph }): Partial<GraphContainerProps> => ({
  renderType: graph.renderType
});

export const Graph = connect(mapStateToProps)(GraphBase);