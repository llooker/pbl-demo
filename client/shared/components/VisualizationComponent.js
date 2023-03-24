import React, { useContext } from 'react';
import { appContextMap} from '../utils/tools';
import { Query, Visualization,  } from "@looker/visualizations";
import { ComponentsProvider } from "@looker/components";
import { DataProvider } from "@looker/components-data";
import { i18nInit as i18nInitVis, i18nResources } from "@looker/visualizations";

i18nInitVis();

export function VisualizationComponent({ item }) {
  const { sdk } = useContext(appContextMap[process.env.REACT_APP_PACKAGE_NAME]);
  // console.log(item, sdk)
  return (
    <DataProvider sdk={sdk}>
    <ComponentsProvider loadGoogleFonts resources={i18nResources}>
    <Query 
    sdk={sdk} 
    query={item.id || item.qid} 
      config={item.config ? item.config : {}}
    >
      <Visualization height={item.height} />
    </Query>
    </ComponentsProvider>
    </DataProvider>
  )
};
