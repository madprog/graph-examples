import { connect } from 'react-redux';
import { DataItem } from '../types';
import React from 'react';

import { AxisLeft, AxisBottom } from '@vx/axis';
import { Group } from '@vx/group';
import { HeatmapRect } from '@vx/heatmap';
import { Text } from '@vx/text';
import { scaleLinear } from '@vx/scale';
import { extent, max, min } from 'd3-array';
import { localPoint } from '@vx/event';
import { withTooltip } from '@vx/tooltip';

const height = 400;
const width = 750;
const margin = {
  top: 60,
  bottom: 60,
  left: 80,
  right: 80,
};
const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;

type BinData = {
  bin: number,
  bins: {
    bin: number,
    count: number,
  }[],
};

type ExternalGraphProps = {
  data: DataItem[],
  nbBinsX: number,
  nbBinsY: number,
  polygon: [number, number][],
};

type GraphProps = ExternalGraphProps & {
  bins: BinData[],
  colorScale: (number) => number,
  xScale: ((number) => number) & { bandwidth: () => number },
  yScale: (number) => number,
};

const density = 10;

const x = (d: DataItem): number => d.x;
const y = (d: DataItem): number => d.y;
const z = (d: DataItem): number => d.hardness;

class GraphBase extends React.PureComponent<GraphProps> {
  render() {
    const {
      bins,
      colorScale,
      nbBinsX,
      nbBinsY,
      polygon,
      yScale,
      xScale,
    } = this.props;
    return (
      <svg viewBox={`0 0 ${width} ${height}`}>
        <Group
          top={margin.top}
          left={margin.left}
        >
          <HeatmapRect
            data={bins}
            xScale={xScale}
            yScale={yScale}
            colorScale={colorScale}
            binWidth={0.5 * xMax / nbBinsX}
            binHeight={yMax / nbBinsY}
            gap={0}
          />
          <path
            style={{
              fill: 'none',
              stroke: '#000000',
              strokeOpacity: 1,
              strokeWidth: '1px',
            }}
             d={`M ${polygon.map(([x, y]) => `${xScale(x)},${yScale(y)}`).join(' ')} Z`}
          />
        </Group>
      </svg>
    );
  }
}

const dataToBins = (data: DataItem[], nbBinsX: number, nbBinsY: number): BinData[] => {
  if (nbBinsX <= 0) {
    throw 'nbBinsX must be strictly positive';
  }
  if (nbBinsY <= 0) {
    throw 'nbBinsY must be strictly positive';
  }
  const [xmin, xmax] = extent(data, x);
  const binSizeX = (xmax - xmin) / nbBinsX;
  if (binSizeX <= 0) {
    throw 'binSizeX too small';
  }
  const [ymin, ymax] = extent(data, y);
  const binSizeY = (ymax - ymin) / nbBinsY;
  if (binSizeY <= 0) {
    throw 'binSizeY too small';
  }
  const bins: {[x:number]: {[y:number]: number[]}} = data.reduce((bins, d) => {
    const groupX = Math.round((nbBinsX - 1) * (x(d) - xmin) / (xmax - xmin));
    const groupY = Math.round((nbBinsY - 1) * (y(d) - ymin) / (ymax - ymin));
    const groupValX = groupX * (xmax - xmin) / (nbBinsX - 1) + xmin;
    const groupValY = groupY * (ymax - ymin) / (nbBinsY - 1) + ymin;
    return ({
      ...bins,
      [groupValX]: {
        ...bins[groupValX],
        [groupValY]: [
          ...(bins[groupValX] || {})[groupValY] || [],
          z(d),
        ],
      },
    });
  }, {});

  return Object.entries(bins)
    .map((e: [string, { [key:number]: number[] }]): BinData => ({
      bin: parseFloat(e[0]),
      bins: Object.entries(e[1])
        .map((e: [string, number[]]): { bin: number, count: number } => ({
          bin: parseFloat(e[0]),
          count: e[1].reduce((s, v) => s + v) / e[1].length,
        })),
    }));
};

export const Graph = withTooltip(connect(
  (state: any, ownProps: GraphProps): Partial<GraphProps> => {
    const { data, nbBinsX, nbBinsY } = ownProps;
    const bins = dataToBins(data, nbBinsX, nbBinsY);
    const colorMin = min(bins, d => min(d.bins, d => d.count));
    const colorMax = max(bins, d => max(d.bins, d => d.count));
    return ({
      bins,
      colorScale: scaleLinear({
        range: ['#ffff00', '#ff0000'],
        domain: [colorMin, colorMax]
      }),
      xScale: scaleLinear({
        range: [0, xMax],
        domain: [-0.5, 1.5],
      }),
      yScale: scaleLinear({
        range: [yMax, 0],
        domain: [0, 1],
      }),
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
  }),
)(GraphBase));
