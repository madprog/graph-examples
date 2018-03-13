import { connect } from 'react-redux';
import { DataItem } from '../types';
import React from 'react';

import { AxisLeft, AxisBottom } from '@vx/axis';
import { bisector } from 'd3-array';
import { curveNatural } from '@vx/curve';
import { Grid } from '@vx/grid';
import { Group } from '@vx/group';
import { BoxPlot } from '@vx/boxplot';
import { Line, LinePath } from '@vx/shape';
import { localPoint } from '@vx/event';
import { scaleLinear } from '@vx/scale';
import { Text } from '@vx/text';
import { withTooltip } from '@vx/tooltip';
import { voronoi } from '@vx/voronoi';
import { extent, quantile } from 'd3-array';

const height = 400;
const width = 750;
const whiskersWidth = 20;
const margin = {
  top: 60,
  bottom: 60,
  left: 80,
  right: 80,
};
const x = (d: DataItem): number => Math.sqrt(d.x * d.x + d.y * d.y);
const y = (d: DataItem): number => d.hardness;
const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;
const xScale = scaleLinear({
  range: [0, xMax - (10 + whiskersWidth)],
  domain: [0, 1000],
});
const yScale = scaleLinear({
  range: [yMax, 0],
  domain: [300, 750],
});
const withVoronoi = false;
const withPoints = false;

type ExternalGraphProps = {
  data: DataItem[],
  hideTooltip: () => void,
  showTooltip: (tooltipInfo: { tooltipLeft: number, tooltipTop: number, tooltipData: { x: number, y: number } }) => void,
};

type GraphProps = ExternalGraphProps & {
  firstQuartile: number,
  handleHideToolTip: (event: any) => void,
  handleShowToolTip: (event: any) => void,
  max: number,
  median: number,
  min: number,
  thirdQuartile: number,
  tooltipData: DataItem,
  tooltipLeft: number,
  tooltipOpen: boolean,
  tooltipTop: number,
  voronoiDiagram: any,
};

class GraphBase extends React.PureComponent<GraphProps> {
  render() {
    const {
      data,
      firstQuartile,
      handleHideToolTip,
      handleShowToolTip,
      max,
      median,
      min,
      thirdQuartile,
      tooltipData,
      tooltipLeft,
      tooltipOpen,
      tooltipTop,
      voronoiDiagram,
    } = this.props;
    return (
      <svg viewBox={`0 0 ${width} ${height}`}>
        <Group
          top={margin.top}
          left={margin.left}
        >
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
            rowLineStyle={{pointerEvents: 'none'}}
            columnLineStyle={{pointerEvents: 'none'}}
          />
          <LinePath
            curve={curveNatural}
            data={data}
            x={x} xScale={xScale}
            y={y} yScale={yScale}
            style={{pointerEvents: 'none'}}
            glyph={(d, i) => withPoints && (
              <circle
                key={`line-dot-${i}`}
                cx={xScale(x(d))}
                cy={yScale(y(d))}
                r={6}
                fill="white"
                stroke="black"
                strokeWidth={3}
              />
            )}
          />
          <BoxPlot
            boxWidth={whiskersWidth}
            fill="none"
            firstQuartile={yScale(firstQuartile)}
            left={xMax}
            max={yScale(max)}
            median={yScale(median)}
            min={yScale(min)}
            stroke="steelblue"
            strokeWidth={2}
            thirdQuartile={yScale(thirdQuartile)}
          />
          {tooltipOpen && (
            <g style={{pointerEvents: 'none'}}>
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
              <Text
                x={tooltipLeft + 10}
                y={yMax - 10}
                fontSize={10}
              >{x(tooltipData)}</Text>
              <Text
                x={10}
                y={tooltipTop - 10}
                fontSize={10}
              >{y(tooltipData)}</Text>
            </g>
          )}
          <rect
            fill="transparent"
            height={yMax}
            onTouchStart={handleShowToolTip}
            onTouchMove={handleShowToolTip}
            onMouseMove={handleShowToolTip}
            onMouseLeave={handleHideToolTip}
            width={xMax}
          />
        </Group>
      </svg>
    );
  }
}

export const Graph = withTooltip(connect(
  (state: any, ownProps: GraphProps): Partial<GraphProps> => {
    const data = [...ownProps.data];
    data.sort((a, b) => x(b) - x(a));
    const [firstQuartile, median, thirdQuartile] = [0.25, 0.5, 0.75].map(p => quantile(data, p, y));
    const [min, max] = extent(data, y);
    return ({
      data,
      firstQuartile,
      max,
      median,
      min,
      thirdQuartile,
      voronoiDiagram: withVoronoi ? voronoi({
        x: d => xScale(x(d)),
        y: d => yScale(y(d)),
        width: xMax,
        height: yMax,
      })(ownProps.data) : undefined,
    });
  },
  (): Partial<GraphProps> => ({}),
  (
    stateProps: Partial<GraphProps>,
    dispatchProps: Partial<GraphProps>,
    ownProps: ExternalGraphProps
  ): Partial<GraphProps> => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    data: stateProps.data,
    handleHideToolTip: (event: any) => ownProps.hideTooltip(),
    handleShowToolTip: withVoronoi ? (event: any) => {
      const { x, y } = localPoint(event);
      const closest = stateProps.voronoiDiagram.find(x - margin.left, y - margin.top);
      if (closest) {
        ownProps.showTooltip({
          tooltipData: closest.data,
          tooltipLeft: closest[0],
          tooltipTop: closest[1],
        });
      }
    } : () => {},
  }),
)(GraphBase));
