export enum GraphType {
  BoxWhisker,
  HeatMap,
  Histogram,
  Line,
}

export enum RenderType {
  VX,
  ECharts,
}

export type DataItem = {
  id: string,
  x: number,
  y: number,
};
