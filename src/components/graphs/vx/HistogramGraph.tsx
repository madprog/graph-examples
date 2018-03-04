import { connect } from 'react-redux';
import { DataItem } from '../types';
import React from 'react';

import { AxisLeft, AxisBottom } from '@vx/axis';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { scaleBand, scaleLinear } from '@vx/scale';
import { extent, max } from 'd3-array';

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

type ExternalGraphProps = {
  data: DataItem[],
  nbBins: number,
};

type GraphProps = ExternalGraphProps & {
};

const collectionToBins = (coll: number[], nbBins: number): [number, number][] => {
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
    .map((e: [string, number]): [number, number] => [parseFloat(e[0]), e[1]]);
}

class GraphBase extends React.PureComponent<GraphProps> {
  render() {
    const {
      data,
      nbBins,
    } = this.props;
    const hardnesses = data.map((i: DataItem): number => i.hardness);
    console.log(hardnesses);
    const bins = collectionToBins(hardnesses, nbBins);
    const x = (d: [number, number]) => d[0];
    const y = (d: [number, number]) => d[1];
    const nbMax = max(bins, y);
    const domain = bins.map(x);
    domain.sort((a, b) => a - b);
    console.log({domain});
    const xScale = scaleBand({
      rangeRound: [0, xMax],
      domain,
      padding: 0.4,
    });
    const yScale = scaleLinear({
      rangeRound: [yMax, 0],
      domain: [0, nbMax],
    });
    return (
      <svg viewBox={`0 0 ${width} ${height}`}>
        <Group
          top={margin.top}
          left={margin.left}
        >
        {bins.map((d: [number, number], i: number) => {
          const [x, y] = d;
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
            />
          );
        })}
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

export const Graph = connect(
  (state: any, ownProps: GraphProps): Partial<GraphProps> => ({}),
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
)(GraphBase);
