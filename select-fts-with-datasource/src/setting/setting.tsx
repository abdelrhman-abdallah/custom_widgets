import {AllDataSourceTypes, IMFieldSchema, Immutable, React, UseDataSource} from "jimu-core";
import {AllWidgetSettingProps} from "jimu-for-builder";
import { MapWidgetSelector } from "jimu-ui/advanced/setting-components";
import def from "./default";
import {DataSourceSelector,FieldSelector  } from "jimu-ui/advanced/data-source-selector";
import {SettingSection,SettingRow} from "jimu-ui/advanced/setting-components";
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
       <SettingSection title={props.intl.formatMessage({
        id:'selectMapLabel',
        defaultMessage:def.selectedMap,
       })}>
        <SettingRow >
          <MapWidgetSelector useMapWidgetIds={props.useMapWidgetIds} onSelect={onMapWidgetSelected}/>
        </SettingRow>
       </SettingSection>
       <SettingSection title={props.intl.formatMessage({
        id:'selectDataSourceLabel',
        defaultMessage:def.layers,
       })}>
          <div className="data-selector-section">
            <selectionRow>
              <DataSourceSelector
              types={Immutable([AllDataSourceTypes.FeatureLayer])}
              useDataSources={props.useDataSources}
              useDataSourcesEnabled = {props.useDataSourcesEnabled}
              onToggleUseDataEnabled={onToggleUseDataEnabled}
              onChange={onDataSourceChange}
              widgetId={props.id}
              />
            </selectionRow>
          </div>
       </SettingSection>
       <SettingSection title={props.intl.formatMessage({
        id:'selectFieldLabel',
        defaultMessage:def.fields,
       })}>
        <div>
          <SettingRow className="field-selector-section">
            {
              props.useDataSources && props.useDataSources.length > 0 &&         
              <FieldSelector 
              useDataSources={props.useDataSources}
              onChange={onFieldChange}
              selectedFields={props.useDataSources[0].fields || Immutable([])}
              />
            }
          </SettingRow>
        </div>
       </SettingSection>


      </div>
    )
  };
  
  export default Setting;