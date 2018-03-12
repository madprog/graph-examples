import { connect } from 'react-redux';
import { DataItem } from '../types';
import React from 'react';

import { AxisLeft, AxisBottom } from '@vx/axis';
import { Line, Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { Text } from '@vx/text';
import { scaleBand, scaleLinear } from '@vx/scale';
import { extent, max } from 'd3-array';
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
  x: number,
  y: number,
};

type ExternalGraphProps = {
  data: DataItem[],
  hideTooltip: () => void,
  nbBins: number,
  showTooltip: (tooltipInfo: { tooltipLeft: number, tooltipTop: number, tooltipData: BinData }) => void,
};

type GraphProps = ExternalGraphProps & {
  bins: BinData[],
  handleHideToolTip: (event: any) => void,
  handleShowToolTip: (event: any) => void,
  tooltipData: BinData,
  tooltipLeft: number,
  tooltipOpen: boolean,
  tooltipTop: number,
  xScale: ((number) => number) & { bandwidth: () => number },
  yScale: (number) => number,
};

class GraphBase extends React.PureComponent<GraphProps> {
  render() {
    const {
      bins,
      handleShowToolTip,
      handleHideToolTip,
      tooltipData,
      tooltipLeft,
      tooltipOpen,
      tooltipTop,
      yScale,
      xScale,
    } = this.props;
    return (
      <svg viewBox={`0 0 ${width} ${height}`}>
        <Group
          top={margin.top}
          left={margin.left}
        >
          {bins.map((d: BinData, i: number) => {
            const { x, y } = d;
            const barHeight = yMax - yScale(y);
            return (
              <Bar
                key={i}
                width={xScale.bandwidth()}
                height={barHeight}
                x={xScale(x)}
                y={yMax-barHeight}
                fill="rgba(92, 119, 235, 1.000)"
                data={{ x, y }}
                onTouchStart={handleShowToolTip}
                onTouchMove={handleShowToolTip}
                onMouseMove={handleShowToolTip}
                onMouseLeave={handleHideToolTip}
              />
            );
          })}
          {tooltipOpen && (
            <g style={{pointerEvents: 'none'}}>
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
                x={tooltipLeft}
                y={tooltipTop - 10}
                fontSize={10}
                textAnchor="middle"
              >{tooltipData.y}</Text>
            </g>
          )}
          <AxisBottom
            scale={xScale}
            top={yMax}
            label={'Hardness (Vickers)'}
            tickFormat={(value) => Math.round(value)}
          />
          <AxisLeft
            scale={yScale}
            top={0}
            left={0}
            label={'Count'}
          />
        </Group>
      </svg>
    );
  }
}

const collectionToBins = (coll: number[], nbBins: number): BinData[] => {
  if (nbBins <= 0) {
    throw 'nbBins must be strictly positive';
  }
  const [min, max] = extent(coll);
  const binSize = (max - min) / nbBins;
  if (binSize <= 0) {
    throw 'binSize too small';
  }
  const bins = coll.reduce((bins, val) => {
    const group = Math.round((nbBins - 1) * (val - min) / (max - min));
    const groupVal = group * (max - min) / (nbBins - 1) + min;
    return ({
      ...bins,
      [groupVal]: (bins[groupVal] || 0) + 1,
    });
  }, {});

  return Object.entries(bins)
    .map((e: [string, number]): BinData => ({
      x: parseFloat(e[0]),
      y: e[1],
    }));
}

export const Graph = withTooltip(connect(
  (state: any, ownProps: GraphProps): Partial<GraphProps> => {
    const { data, nbBins } = ownProps;
    const hardnesses = data.map((i: DataItem): number => i.hardness);
    const bins = collectionToBins(hardnesses, nbBins);
    const x: (BinData) => number = (d: BinData): number => d.x;
    const y: (BinData) => number = (d: BinData): number => d.y;
    const nbMax = max(bins, y);
    const domain = bins.map(x);
    domain.sort((a, b) => a - b);
    return ({
      bins,
      xScale: scaleBand({
        rangeRound: [0, xMax],
        domain,
        padding: 0.4,
      }),
      yScale: scaleLinear({
        rangeRound: [yMax, 0],
        domain: [0, nbMax],
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
    handleHideToolTip: (data: BinData) => (event: any) => ownProps.hideTooltip(),
    handleShowToolTip: (data: BinData) => (event: any) => {
      ownProps.showTooltip({
        tooltipData: data,
        tooltipLeft: stateProps.xScale!(data.x) + 0.5 * stateProps.xScale!.bandwidth(),
        tooltipTop: stateProps.yScale!(data.y),
      });
    },
  }),
)(GraphBase));
