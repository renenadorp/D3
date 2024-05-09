// const readXlsxFile = require('read-excel-file/node')
import React, { createContext, useEffect, useState } from "react";
import * as d3 from "d3";
import Dexie from "dexie";

import { read, utils } from 'xlsx';
import base64 from './data/philosophy.xlsx';

import CONST from '@/app/d3config';

export async function getStaticProps() {
  /* parse base64 data */
  const wb = read(base64, { type: "base64" });
  return { props: {
      /* generate array of objects from the first sheet */
      data: utils.sheet_to_json(wb.Sheets[wb.SheetNames[1]])
  } };
}

export const PhilosophyContext = createContext();

const db = new Dexie("PhilosphyDatabase");
db.version(1).stores({
  csvData: "++id, data",
});


function getLabelData(rows) {
  var label_data = rows.filter(row => {
    return (row.hasOwnProperty("Annotation"))
  }
  );
  return label_data;
}

function getData(){
  var data;
  var result = getStaticProps().then(p=>{return p.props.data});
    // .then(rows => {
    //   var data   = rows.props.data;
    //   var labelData = getLabelData(data);
    //   // DATA PREP
    //   data.forEach(function (d) {
    //   d.Date = new Date(Date.UTC(d.Year, d.Month, d.Day, 0, 0, 0, 0));
    //   d.Date.setUTCFullYear(d.Year);
    //   d.Value = DIMS.HEIGHT - (+d.TimeLineId * 35 +160);
    //   });        
    //   }
    //   )

    return result;
    }

export const PhilosophyContextProvider = ({ children }) => {
  const [value, setValue] = useState(null);

  useEffect(() => {

    const loadData = async () => {
      // const cachedData = await db.csvData.toArray();
      // if (cachedData.length === 0) {
      // fetch and save to IndexedDB
      //   const response =  getData();
      //   console.log('response:', response)
      //   data = response;
      //   db.csvData.put({ data: response });
      // } else {
      //   // use data from IndexedDB
      //   data = cachedData[0].data;
      // }
      var dataPromise =  getStaticProps().then(p=>{return p.props.data});

      async function awaitPromise() {
        try {
          const result = await dataPromise;

           // DATA PREP
          result.forEach(function (d) {


          d.Date = new Date(Date.UTC(d.Year, d.Month, d.Day, 0, 0, 0, 0));
          d.Date.setUTCFullYear(d.Year);

          d.Value = CONST.SCREEN.HEIGHT - (+d.TimeLineId * 25 );
          });


          setValue(result);
        } catch (err) {
          console.log(err);
        }
      }
      
      awaitPromise();


    };

    loadData();
  }, []);
  return <PhilosophyContext.Provider value={value}>{children}</PhilosophyContext.Provider>;
};
