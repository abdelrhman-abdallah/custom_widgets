import {
  React,
  type AllWidgetProps,
  FeatureLayerQueryParams,
  type DataSource,
  type IMDataSourceInfo,
  DataSourceStatus,
  DataSourceComponent,
  DataRecord,
  esri,
  DataSourceManager,
} from 'jimu-core';
import { type IMConfig } from '../config';
import { JimuLayerView, JimuMapView, JimuMapViewComponent } from 'jimu-arcgis';
import FeatureLayer from 'esri/layers/FeatureLayer';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import { Field } from 'dist/widgets/arcgis/query/src/config';
import FeaturesSet from 'dist/widgets/arcgis/near-me/src/runtime/components/features-set';


const { useState, useEffect, useRef } = React;

const Widget = (props: AllWidgetProps<IMConfig>) => {

  
  const [query, setQuery] = useState<FeatureLayerQueryParams>(null);
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>(null);
  const [activeLayerId, setActiveLayerId] = useState<string>(null);
  const[queryField,setQueryField] = useState(null);
  const [queriedFeatures, setQueriedFeatures] = useState<Graphic[]>([]);
  const [queriedFeaturesFields, setQueriedFeaturesFields] = useState<Field[]>(
    []
  );

  const userInputQuery = useRef<HTMLInputElement>();

  useEffect(() => {
    if(activeLayerId){
      const layer:FeatureLayer = getLayerById(activeLayerId);
      executeQueryWhenQueryFieldChoosen(layer);
    }
  }, [activeLayerId,queryField]);

const getLayerById = (id:string) =>{
  const targetLayer = getAllLayers().find((layer)=>
    layer.id === id
  )
  return targetLayer;
}

const getAllLayers = () =>{
  if(!jimuMapView){
    return [];
  }
  const layers = jimuMapView.view.map.allLayers.filter((layer)=>layer.type === 'feature')
  return layers;
}


const mapQueryWhenQueryFieldChoosen =  ()=>{
  if(!queryField){
    setQuery({
      where: '1=1',
      outFields:['*'],
      pageSize:10,
      returnGeometry:true,
  })
  return '1=1';
}else{
    const fieldName = queriedFeaturesFields[queryField].name;
    const whereClause = userInputQuery.current && userInputQuery.current.value ? `${fieldName} like '%${userInputQuery.current.value}%'`:'1=1';
    console.log(whereClause);
    
      setQuery({
      where: whereClause,
      outFields:['*'],
      pageSize:10,
      returnGeometry:true,
      
    })
    return whereClause;
  }
}

const executeQueryWhenQueryFieldChoosen = (layer:FeatureLayer)=>{
    console.log(queryField);
  
    const queryInit = layer.createQuery();
    let where = mapQueryWhenQueryFieldChoosen();
    if(!query){
      queryInit.where = where;
      queryInit.outFields = ['*'];
      queryInit.returnGeometry = true;
    }else{
      queryInit.where = where;
      queryInit.outFields = query.outFields;
      queryInit.returnGeometry = query.returnGeometry;
    }
    layer.queryFeatures().then(res=>{
      console.log(res.features);
      
      setQueriedFeatures(res.features);
      setQueriedFeaturesFields(res.fields);
      highlightQueriedFeatures(layer,res);
    })
}

const highlightQueriedFeatures = (layer:FeatureLayer,layerSubSet:__esri.FeatureSet)=>{

  jimuMapView.view.allLayerViews.removeAll();

  jimuMapView.view.whenLayerView(layer).then((lv)=>{
    
    lv.highlight(layerSubSet.features);
  })
  // layerSubSet.features.map(f=>{
  //   const graphic = new Graphic({
  //     geometry:f.geometry,
  //     attributes:f.attributes,
  //   })
  //   graphicsLayer.add(graphic);
  // })
  // jimuMapView.view.map.add(graphicsLayer);
  jimuMapView.view.goTo(layerSubSet.queryGeometry);
}

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };



  return (
    <>
      <div className="widget-starter jimu-widget m-2">
        {
            props.useMapWidgetIds &&
            props.useMapWidgetIds.length === 1 && (
              <JimuMapViewComponent
                useMapWidgetId={props.useMapWidgetIds?.[0]}
                onActiveViewChange={activeViewChangeHandler}
              />
        )}
        {
          <ul>
            {getAllLayers().length === 0 && <li>No Layers yet</li>}
            {getAllLayers().map((l:FeatureLayer)=><li onClick={()=> setActiveLayerId(l.id) }>{l.title}</li>)}
          </ul>
        }
        <hr />
        {
          getAllLayers().length > 0 &&
          <div className="fields-container">
            <ul>
              {queriedFeaturesFields.length ===0 && <li>Choose a layer to get its fields</li>}
              {queriedFeaturesFields.map((field, index) => (
                <li onClick={(evt)=>setQueryField(evt.currentTarget.value)} key={index} value={index}>{field.name}</li>
              ))}
            </ul>
            <hr />
          </div>

        }


        {
          getAllLayers().length > 0 && queryField && 
          <div>
            <input placeholder="Query value" ref={userInputQuery} />
            <button className='jimu-btn' onClick={()=> {
                executeQueryWhenQueryFieldChoosen(getLayerById(activeLayerId));
              }}>Query</button>
          </div>
        }
      </div>

    </>
  );
};

export default Widget;
