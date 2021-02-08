import _ from 'lodash'
export const handleTileToggle = (event, newValue, lookerContent, dashboardOptions) => {
  let dynamicTileFilterItem = _.find(lookerContent[0].filters, { label: "Dynamic Tiles" });

  if (dynamicTileFilterItem) {
    // setTileToggleValue(newValue)
    const filteredLayout = _.filter(dashboardOptions.layouts[0].dashboard_layout_components, (row) => {
      return (dynamicTileFilterItem.tileLookUp[newValue].indexOf(dashboardOptions.elements[row.dashboard_element_id].title) > -1)
    })

    const newDashboardLayout = {
      ...dashboardOptions.layouts[0],
      dashboard_layout_components: filteredLayout
    }
    // dashboardObj.setOptions({ "layouts": [newDashboardLayout] })
    return newDashboardLayout;

  }
};

