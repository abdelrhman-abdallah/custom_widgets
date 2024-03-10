import {
  AllDataSourceTypes,
  IMFieldSchema,
  Immutable,
  React,
  UseDataSource,
} from 'jimu-core';
import { AllWidgetSettingProps } from 'jimu-for-builder';
import {
  MapWidgetSelector,
  SettingSection,
  SettingRow,
} from 'jimu-ui/advanced/setting-components';
import {
  DataSourceSelector,
  FieldSelector,
} from 'jimu-ui/advanced/data-source-selector';
import { UseDataSources } from 'dist/widgets/common/table/tests/config';

const Setting = (props: AllWidgetSettingProps<any>) => {
  // const onFieldChange = (allSelectedFields:IMFieldSchema[])=>{
  //     props.onSettingChange({
  //       id:props.id,
  //       useDataSources: [{ ...props.useDataSources[0], ...{fields: allSelectedFields.map(f=>f.jimuName) } }]
  //     })
  // }

  // const onToggleUseDataEnabled = (useDataSourcesEnabled: boolean)=>{
  //   props.onSettingChange({
  //     id: props.id,
  //     useDataSourcesEnabled:useDataSourcesEnabled
  //   })
  // }

  // const onDataSourceChange = (useDataSources:UseDataSource[]) =>{
  //   props.onSettingChange({
  //     id:props.id,
  //     useDataSources
  //   })
  // }

  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds: useMapWidgetIds,
    });
  };
  return (
    <div>
      <div>
        <SettingSection>
          <SettingRow>
            <MapWidgetSelector
              onSelect={onMapWidgetSelected}
              useMapWidgetIds={props.useMapWidgetIds}
            />
          </SettingRow>
        </SettingSection>
      </div>
    </div>
  );
};

export default Setting;
