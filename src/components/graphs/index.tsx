import { GraphType } from './types';
import { Data as BoxWhiskerGraphData, Graph as BoxWhiskerGraph } from './BoxWhiskerGraph';
import { Data as HeatMapGraphData, Graph as HeatMapGraph } from './HeatMapGraph';
import { Data as HistogramGraphData, Graph as HistogramGraph } from './HistogramGraph';
import { Data as LineGraphData, Graph as LineGraph } from './LineGraph';

export const graphElements: {[key:number]:any} = {
  [GraphType.BoxWhisker]: BoxWhiskerGraph,
  [GraphType.HeatMap]:    HeatMapGraph,
  [GraphType.Histogram]:  HistogramGraph,
  [GraphType.Line]:       LineGraph,
};
