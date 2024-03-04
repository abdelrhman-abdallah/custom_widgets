import { React, type AllWidgetProps } from 'jimu-core';
import { type IMConfig } from '../config';
//import Query from 'jimu-arcgis'
import {
  JimuMapView,
  JimuMapViewComponent,
  loadArcGISJSAPIModules,
} from 'jimu-arcgis';
import '../runtime/style.css';
import { useEffect, useState } from 'react';

//to import query from jimu-arcgis we deleted "arcgis-js-api" from tsconfigjson in client server
const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [jimuMapView, setJimuMapView] = useState(null);
  const [fields, setFields] = useState([]);
  const [activeLayerId, setActiveLayerId] = useState(null);
  const [data, setData] = useState([]);

  let getFields = (layer) => {
    return layer.fields;
  };

  let getData = (activeLayerId) => {
    let targetLayer = getLayerById(activeLayerId);

    let ResData;
    loadArcGISJSAPIModules(['esri/rest/support/Query']).then(() => {
      let query = targetLayer.createQuery();
      query.where = '1=1';
      query.outFields = ['*'];
      query.returnGeometry = true;

      targetLayer.queryFeatures(query).then(function (response) {
        setData(response.features);
        console.log('data in state', data);
      });
    });
    return ResData;
  };

  let activeLayer;
  useEffect(() => {
    if (activeLayerId) {
      activeLayer = getLayerById(activeLayerId);

      const fieldss = getFields(activeLayer);

      setFields(fieldss);

      loadArcGISJSAPIModules(['esri/rest/support/Query']).then(() => {
        let query = activeLayer.createQuery();
        query.where = '1=1';
        query.outFields = ['*'];
        query.returnGeometry = true;

        activeLayer.queryFeatures(query).then(function (response) {
          setData(response.features);
        });
      });
    }
  }, [activeLayerId]);
  console.log('data from state  useeffect', data);

  const getLayerById = (layerId) => {
    const targetLayer = getLayers().find((layer) => {
      return layer.id === layerId;
    });
    return targetLayer;
  };

  const getLayers = () => {
    if (!jimuMapView) {
      return [];
    }

    const layers = jimuMapView.view.map.layers.items;
    return layers;
  };
  return (
    <>
      <div className="widget-demo jimu-widget m-2">
        {props.hasOwnProperty('useMapWidgetIds') &&
          props.useMapWidgetIds &&
          props.useMapWidgetIds.length === 1 && (
            <JimuMapViewComponent
              useMapWidgetId={props.useMapWidgetIds?.[0]}
              onActiveViewChange={(jmv: JimuMapView) => {
                setJimuMapView(jmv);
              }}
            />
          )}
        {
          <ul>
            {getLayers().map((layer) => (
              <li
                onClick={() => {
                  setActiveLayerId(layer.id);
                  getFields(layer);
                  getData(layer.id);
                }}
                key={layer.id}
                id={layer.id}
              >
                {layer.title}
              </li>
            ))}
            {getLayers().length === 0 && <li>No Layers yet</li>}
          </ul>
        }
        <hr />
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {fields.map((field, index) => (
                  <th key={index}>{field.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((feature, index) => (
                <tr key={index}>
                  {fields.map((field) => (
                    <td key={field.name}>{feature.attributes[field.name]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Widget;
