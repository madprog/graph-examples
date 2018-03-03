import { connect } from 'react-redux';
import { GraphProps, Graph } from './Graph';

// The state of the graph
export class GraphState {
}

// Reducers
export const graphReducer = (state:GraphState = new GraphState()): GraphState => {
  return state;
};

// Mapping of the state to the graph props
const mapStateToProps = (): Partial<GraphProps> => ({
});

// Mapping of dispatch to properties
const mapDispatchToProps = (dispatch: any): Partial<GraphProps> => ({
});

// The 'connect' take a Container and returns a high order component
export const GraphContainer = connect(mapStateToProps, mapDispatchToProps)(Graph);
