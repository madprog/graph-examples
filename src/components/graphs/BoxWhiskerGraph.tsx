import * as React from 'react';
export type Data = [number,number][];

// Properties
export type GraphProps = {
  data: Data,
}

export class Graph extends React.PureComponent<GraphProps> {
  render() {
    return (
      <span>BoxWhisker</span>
    );
  }
}
