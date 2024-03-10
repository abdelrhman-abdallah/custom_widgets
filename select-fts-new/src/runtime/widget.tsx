import {React,type AllWidgetProps,FeatureLayerQueryParams,} from 'jimu-core';
import { type IMConfig } from '../config';
import {  JimuMapView, JimuMapViewComponent } from 'jimu-arcgis';
import FeatureLayer from 'esri/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';
import { Field } from 'dist/widgets/arcgis/query/src/config';
import './style.css';
import { log } from 'console';

const { useState, useEffect, useRef } = React;

const Widget = (props: AllWidgetProps<IMConfig>) => {

  
  const [currentHighLight, setCurrentHighlight] = useState(null);
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>(null);
  const [activeLayerId, setActiveLayerId] = useState<string>(null);
  const[queryField,setQueryField] = useState(null);
  const [queriedFeatures, setQueriedFeatures] = useState<Graphic[]>([]);
  const [queriedFeaturesFields, setQueriedFeaturesFields] = useState<Field[]>(
    []
  );


  const userQueryFieldInput = useRef<HTMLSelectElement>();
  const userQueryOperatorInput = useRef<HTMLSelectElement>();
  const userSearchPatternInput = useRef<HTMLInputElement>();

  const operators = ['LIKE','>','<','=','<>','>=','<=','BETWEEN ']

  useEffect(() => {
    if(activeLayerId){
      const layer:FeatureLayer = getLayerById(activeLayerId);
      executeQuery(layer,'1=1');
    }
  }, [activeLayerId,queryField]);

const getLayerById = (id:string):FeatureLayer =>{
  const targetLayer = getAllLayers().find((layer)=>
    layer.id === id
  )
  return targetLayer;
}

const getAllLayers = () =>{
  if(!jimuMapView){
    return [];
  }else{
    const layers = jimuMapView.view.map.allLayers.filter((layer)=> layer.type === 'feature')
    return layers;
  }
}


const buildQueryCondition =  (evt) : string=>{
  if(userQueryFieldInput && userQueryOperatorInput && userSearchPatternInput){
    const fieldName = evt.target.fieldName.value;
    const queryOpertator = evt.target.queryOperator.value;
    const searchPatten =evt.target.pattern.value;

    return `${fieldName} ${queryOpertator} '%${searchPatten}%'`
}
  return '1=1';
}

const submitFormHandler = (e) =>{
  e.preventDefault();
  let whereCondition = buildQueryCondition(e);
  let layer = getLayerById(activeLayerId);
  console.log("in submission",whereCondition);
  
  executeQuery(layer,whereCondition);
}

const executeQuery = (layer:FeatureLayer,where:string)=>{
  
    const queryInit = layer.createQuery();
    
    queryInit.where = where;
    queryInit.outFields = ['*'];
    queryInit.returnGeometry = true;

    layer.queryFeatures(queryInit).then(res=>{
      if (res.features.length > 0) {
        setQueriedFeatures(res.features);
        setQueriedFeaturesFields(res.fields);
        highLightQueriedFeatures(layer,res);
        zoomToQueriedFeatures(res);
      }
    }).catch((err) => {
      console.error(err);
    });
}


const highLightQueriedFeatures = (layer:FeatureLayer, layerSubSet:__esri.FeatureSet) => {
  jimuMapView.view.whenLayerView(layer).then(layerView => {
    if(currentHighLight){
      currentHighLight?.remove();
    }
    setCurrentHighlight(layerView.highlight(layerSubSet.features));
  }).catch(err => {
    console.error("Error highlighting features:", err);
  });
};

const zoomToQueriedFeatures = (layerSubSet) => {
  jimuMapView.view.goTo({
    target: layerSubSet.features,
    zoom: -1,
  }).then(() => {
    console.log("Zoomed to the features");
  }).catch(err => {
    console.error("Error zooming to features:", err);
  });
};


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
          <ul className='layer-container'>
            {getAllLayers().length === 0 && <li>No Layers yet</li>}
            {getAllLayers().map((l:FeatureLayer)=><li className='layer-element' onClick={()=> setActiveLayerId(l.id) }>{l.title}</li>)}
          </ul>
        }
        <hr />
        {
          getAllLayers().length > 0 && activeLayerId && 
          <div>
          <form onSubmit={submitFormHandler}>
          <label htmlFor='fieldName'>Field: </label>
          <select name="fieldName" ref={userQueryFieldInput} id="fieldName">
            {getLayerById(activeLayerId).fields.map((f,idx)=>(
                <option key={idx} value={f.name}>{f.name}</option>
            ))}
          </select>
          <label htmlFor="queryOperator">Operator: </label>
          <select name="queryOperator" ref={userQueryOperatorInput} id="queryOperator">
            {operators.map((op,idx)=>(
                <option key={idx} value={op}>{op}</option>
            ))}
          </select>
          <label htmlFor="pattern">Search Pattern : </label>
          <input placeholder = "Search Pattern" id='pattern' type="text"  ref={userSearchPatternInput}/>
          <button type="submit">Query</button>
          </form>
          </div>
        }
      </div>

    </>
  );
};

export default Widget;
