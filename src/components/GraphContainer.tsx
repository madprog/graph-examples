import { connect } from 'react-redux';
import { GraphProps, Graph } from './Graph';

import { GraphType } from './graphs/types';
import { graphElements } from './graphs';

// The state of the graph
export class GraphState {
  readonly graphType: GraphType = GraphType.BoxWhisker;
}

// Common base action type
export type SimpleAction<T> = { readonly type: T; }
export type ActionWithPayload<T, P> = { readonly type: T; readonly payload: P; }

// Counter specific action types
export type ChangeGraphAction = ActionWithPayload<'CHANGE_GRAPH', GraphType>;
export function replaceGraphType(graphType: GraphType): ChangeGraphAction {
  return { type: 'CHANGE_GRAPH', payload: graphType };
}

// The union of all posible action types
export type GraphAction = ChangeGraphAction;

// Reducers
export const graphReducer = (state:GraphState = new GraphState(), action: GraphAction): GraphState => {
  switch (action.type) {
    case 'CHANGE_GRAPH':
      return state.graphType !== action.payload ? {
        ...state,
        graphType: action.payload,
      } : state;
    default:
      return state;
  }
};

// Mapping of the state to the graph props
const mapStateToProps = ({ graph }): Partial<GraphProps> => ({
  graphElement: graphElements[graph.graphType],
  graphType: graph.graphType,
  graphTypes: Object.keys(GraphType)
    .filter((k: string): boolean => GraphType.hasOwnProperty(k) && isNaN(parseInt(`${k}`)))
    .map((k: string): [string, string] => [GraphType[k], k]),
});

// Mapping of dispatch to properties
const mapDispatchToProps = (dispatch: any): Partial<GraphProps> => ({
  handleChangeGraphType: (event: any, newGraphType: GraphType) => dispatch(replaceGraphType(newGraphType)),
});

// The 'connect' take a Container and returns a high order component
export const GraphContainer = connect(mapStateToProps, mapDispatchToProps)(Graph);
