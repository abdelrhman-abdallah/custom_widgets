import { React, type AllWidgetProps, FeatureLayerQueryParams, type DataSource, type IMDataSourceInfo, DataSourceStatus, DataSourceComponent, DataRecord, esri, DataSourceManager} from 'jimu-core';
import { type IMConfig } from '../config';
import {JimuMapView,JimuMapViewComponent  } from "jimu-arcgis";
import  FeatureLayer from "esri/layers/FeatureLayer";
import Graphic from '@arcgis/core/Graphic';
import intl from '@arcgis/core/intl';
import geometry from '@arcgis/core/geometry';
import { log } from 'console';
import Point from '@arcgis/core/geometry/Point';

const {useState,useEffect,useRef} = React; 

const Widget = (props: AllWidgetProps<IMConfig>) => {

  const [query,setQuery] = useState<FeatureLayerQueryParams>({
    where:'1=1',
    returnGeometry:true,
    outFields:['*']
  });
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>();
  const [addedLayer, setAddedLayer] = useState<FeatureLayer | null>(null);


  const countryName = useRef<HTMLInputElement>();


  useEffect(()=>{
      queryFunc();
  },[query])


  const isDsConfigured = ()=>{
    if(props.useDataSources && props.useDataSources.length >0 && props.useDataSources[0].fields && props.useDataSources[0].fields.length > 0){
      return true;
    }
    else{
      return false;
    }
  }

  const activeViewChangeHandler = (jmv:JimuMapView) => {
    if(jmv){
      setJimuMapView(jmv);
    }
  }


  const queryFunc =  ()=>{
    if(isDsConfigured() === false){
        return;
    }else{
      const fieldName = props.useDataSources[0].fields[0];
      console.log(fieldName);
      
      const whereClause = countryName.current && countryName.current.value ? `${fieldName} like '%${countryName.current.value}%'`:'1=1';
      console.log(whereClause);
      
        setQuery({
        where: whereClause,
        outFields:['*'],
        pageSize:10,
        returnGeometry:true,
      })
    }
  }

  

  const executeQuery = async (ds:DataSource) =>{
    if(!ds){
      console.error("Data source is not set.");
      return;
    }

    const layerExists = jimuMapView.view.map.allLayers.includes(addedLayer);
    
    if (layerExists) {
      jimuMapView.view.map.remove(addedLayer);
    }
      let url = ds.getDataSourceJson().url;
    
      const layer = new FeatureLayer({
        url:url,
      })
  
      let queryExecute = layer.createQuery();
      queryExecute.where = query.where;
      queryExecute.outFields = query.outFields;
      queryExecute.returnGeometry = query.returnGeometry;
      const queryResultSet = await layer.queryFeatures(queryExecute);
      makeLayerFromQueriedData(queryResultSet);

  }

  const makeLayerFromQueriedData = (layerSubSet:__esri.FeatureSet)=>{
    const queriedLayer = new FeatureLayer({
      source:layerSubSet.features,
      fields:layerSubSet.fields,
    })
    addLayerToMap(jimuMapView,queriedLayer);
  }
  
  const addLayerToMap = (jmv:JimuMapView,layer:FeatureLayer) =>{
    if(jmv){
      jmv.view.map.add(layer);
      setAddedLayer(layer);
      zoomToLayerExtent(jmv,layer);
    }
  }

const zoomToLayerExtent = (jmv: JimuMapView, layer:FeatureLayer) => {
  layer.when(() => {
    return layer.queryExtent();
  })
  .then(res => {
    jmv.view.goTo(res.extent);
  })
  .catch(err => {
    console.error(err);
  });
};

  const dataRender = (ds: DataSource, info: IMDataSourceInfo) => {
    const fName = props.useDataSources[0].fields[0];
    return <>
      <div>
        <input placeholder="Query value" ref={countryName} />
        <button className='jimu-btn' onClick={()=> {
          queryFunc();
          executeQuery(ds);
          }}>Query</button>
      </div>
      <div>Query state: {info.status}</div>
      <div>Count: {ds.count}</div>

      {/* <div className="record-list" style={{ width: '100%', marginTop: '20px', height: 'calc(100% - 80px)', overflow: 'auto' }}>
        {
          ds.count > 0 && ds.getStatus() === DataSourceStatus.Loaded
            ?ds.getRecords().map((r, i) => {
              return <div key={i}>{r.getData()["CITY_NAME"]}</div>
            })
            : null
        }
      </div> */}
    </>
  }

  if (!isDsConfigured()) {
    return <h3>
      This widget demonstrates how to use a feature layer as a data source.
      <br />
      Configure the data source.
    </h3>
  }
  return <div className="jimu-widget p-2" style={{ width: '100%', height: '100%', maxHeight: '800px', overflow: 'auto' }}>
    <h3 className='jimu-esri-widget__header'>
      This widget shows how to use a feature layer as a data source.
    </h3>
    <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]}  onActiveViewChange={activeViewChangeHandler}>
      <DataSourceComponent useDataSource={props.useDataSources[0]} query={query}  widgetId={props.id} queryCount>
        {dataRender}
      </DataSourceComponent>
    </JimuMapViewComponent>
  </div>
}

export default Widget
