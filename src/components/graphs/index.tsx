import { GraphType } from './types';
import { Graph as BoxWhiskerGraph } from './BoxWhiskerGraph';
import { Graph as HeatMapGraph } from './HeatMapGraph';
import { Graph as HistogramGraph } from './HistogramGraph';
import { Graph as LineGraph } from './LineGraph';

export const graphElements: {[key:number]:any} = {
  [GraphType.BoxWhisker]: BoxWhiskerGraph,
  [GraphType.HeatMap]:    HeatMapGraph,
  [GraphType.Histogram]:  HistogramGraph,
  [GraphType.Line]:       LineGraph,
};
