import React, {   useContext } from 'react';
import { appContextMap} from '../utils/tools';
import { Query, Visualization,  } from "@looker/visualizations";

export function VisualizationComponent({ item }) {
  // console.log("VisualizationComponent")
  // console.log({item})
  const {  sdk } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  return (
    <Query sdk={sdk} query={item.id || item.qid} 
      config={item.config ? item.config : {}}
    >
      <Visualization height={item.height} />
    </Query>
  )
};
