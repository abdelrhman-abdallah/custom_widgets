/** @jsx jsx */

import { AllDataSourceTypes, Immutable, jsx, UseDataSource } from 'jimu-core'
import { AllWidgetSettingProps } from 'jimu-for-builder'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import { MapWidgetSelector, SettingRow, SettingSection } from 'jimu-ui/advanced/setting-components'

export default function (props: AllWidgetSettingProps<any>) {
  const onMapSelected = (useMapWidgetIds: string[]) => {
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds: useMapWidgetIds
    })
  }

  const onDataSourceChange = (useDataSources: UseDataSource[]) => {
    props.onSettingChange({
      id: props.id,
      useDataSources: useDataSources
    })
  }

  return (
    <div>
      <div className="widget-setting-get-map-coordinates">
        <SettingSection
          title="selectedMapLabel"
        >
          <SettingRow>
            <MapWidgetSelector
              onSelect={onMapSelected}
              useMapWidgetIds={props.useMapWidgetIds}
            />
          </SettingRow>
        </SettingSection>
        <SettingSection>
        <DataSourceSelector
          types={Immutable([AllDataSourceTypes.FeatureLayer])}
          useDataSources={props.useDataSources}
          useDataSourcesEnabled={props.useDataSourcesEnabled}
          mustUseDataSource={true}
          onChange={onDataSourceChange}
          widgetId={props.id}
    />
        </SettingSection>
      </div>
    </div>
  )
}
