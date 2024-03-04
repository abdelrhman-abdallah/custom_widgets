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
import { JimuMapView, JimuMapViewComponent } from 'jimu-arcgis';
import FeatureLayer from 'esri/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';
import intl from '@arcgis/core/intl';
import geometry from '@arcgis/core/geometry';
import { log } from 'console';
import Point from '@arcgis/core/geometry/Point';
import { Field } from 'dist/widgets/arcgis/query/src/config';
import { getLayer } from '@esri/arcgis-rest-feature-layer';
import Query from '@arcgis/core/rest/support/Query';

const { useState, useEffect, useRef } = React;

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const [query, setQuery] = useState<FeatureLayerQueryParams>(null);
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>(null);
  const [activeLayerId, setActiveLayerId] = useState<string>(null);
  const [queriedFeatures, setQueriedFeatures] = useState<Graphic[]>([]);
  const [queriedFeaturesFields, setQueriedFeaturesFields] = useState<Field[]>(
    []
  );
  useEffect(() => {
    if (activeLayerId) {
      getLayerQueriedFeatures(query, activeLayerId).then((res) => {
        setQueriedFeatures(res.features);
        setQueriedFeaturesFields(res.fields);
      });
    }
  }, [activeLayerId]);

  const getAllLayers = () => {
    if (!jimuMapView) {
      return [];
    } else {
      const layers = jimuMapView.view.map.layers;
      return layers;
    }
  };

  const getLayerById = (id: string) => {
    const targetLayer = getAllLayers().find((l) => l.id === id);
    return targetLayer;
  };

  const getLayerQueriedFeatures = (
    query: FeatureLayerQueryParams,
    id: string
  ) => {
    console.log('inside query');

    let queriedData;
    let targetLayer = getLayerById(id);
    console.log(targetLayer);

    if (targetLayer) {
      const queryExec = targetLayer.createQuery();
      if (query) {
        queryExec.where = query.where;
        queryExec.returnGeometry = query.returnGeometry;
        queryExec.outFields = query.outFields;
      } else {
        queryExec.where = '1=1';
        queryExec.outFields = ['*'];
        queryExec.returnGeometry = true;
        setQuery(queryExec);
      }
      targetLayer.queryFeatures().then((res) => (queriedData = res));
      return queriedData;
    }
  };

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };

  return (
    <>
      <div className="widget-starter jimu-widget m-2">
        {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent
            useMapWidgetId={props.useMapWidgetIds?.[0]}
            onActiveViewChange={activeViewChangeHandler}
          />
        )}
      </div>
      {
        <ul>
          {getAllLayers().map((layer) => (
            <li
              onClick={() => {
                setActiveLayerId(layer.id);
                const qFeatures = getLayerQueriedFeatures(query, layer.id);
                setQueriedFeatures(qFeatures.features);
                setQueriedFeaturesFields(qFeatures.fields);
              }}
              key={layer.id}
              id={layer.id}
            >
              {layer.title}
            </li>
          ))}
          {getAllLayers().length === 0 && <li>No Layers Loaded</li>}
        </ul>
      }
    </>
  );
};

export default Widget;
