import {AllDataSourceTypes, IMFieldSchema, Immutable, React, UseDataSource} from "jimu-core";
import {AllWidgetSettingProps} from "jimu-for-builder";
import { MapWidgetSelector } from "jimu-ui/advanced/setting-components";
import {DataSourceSelector,FieldSelector  } from "jimu-ui/advanced/data-source-selector";
import { UseDataSources } from "dist/widgets/common/table/tests/config";


const Setting = (props: AllWidgetSettingProps<any>) => {

  const onFieldChange = (allSelectedFields:IMFieldSchema[])=>{
      props.onSettingChange({
        id:props.id,
        useDataSources: [{ ...props.useDataSources[0], ...{fields: allSelectedFields.map(f=>f.jimuName) } }]
      })
  }

  const onToggleUseDataEnabled = (useDataSourcesEnabled: boolean)=>{
    props.onSettingChange({
      id: props.id,
      useDataSourcesEnabled:useDataSourcesEnabled
    })
  }

  const onDataSourceChange = (useDataSources:UseDataSource[]) =>{
    props.onSettingChange({
      id:props.id,
      useDataSources
    })
  }


  const onMapWidgetSelected = (useMapWidgetIds:string[])=>{
    props.onSettingChange({
      id:props.id,
      useMapWidgetIds: useMapWidgetIds,
    })
  } 
    return (
      <div className="widget-setting-demo">
        <h5>Please select your map Widget</h5>
        <MapWidgetSelector useMapWidgetIds={props.useMapWidgetIds} onSelect={onMapWidgetSelected}/>
        <h5>Please Select Your Layer</h5>
        <DataSourceSelector
          types={Immutable([AllDataSourceTypes.FeatureLayer])}
          useDataSources={props.useDataSources}
          useDataSourcesEnabled = {props.useDataSourcesEnabled}
          onToggleUseDataEnabled={onToggleUseDataEnabled}
          onChange={onDataSourceChange}
          widgetId={props.id}
        />
        <h5>Please Select Your Field</h5>
        {
          props.useDataSources && props.useDataSources.length > 0 &&         
          <FieldSelector 
          useDataSources={props.useDataSources}
          onChange={onFieldChange}
          selectedFields={props.useDataSources[0].fields || Immutable([])}
          />
        }

      </div>
    )
  };
  
  export default Setting;