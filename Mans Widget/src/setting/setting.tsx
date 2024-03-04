import { React } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import {
  MapWidgetSelector,
  SettingSection,
  SettingRow
} from 'jimu-ui/advanced/setting-components'

import { type IMConfig } from '../config'

export default function (props: AllWidgetSettingProps<IMConfig>) {
 

  

  const onMapWidgetSelected= (useMapWidgetIds: string[]) => {
    //console.log(props);
   // console.log(props.onSettingChange);

    
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds: useMapWidgetIds
    })
  }

 
  return (
    <div >
      <div >
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
  )
};