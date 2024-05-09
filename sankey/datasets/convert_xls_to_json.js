
const XLS_FILE 	= "datasets/obvion.xlsx";
const SCHEMAS  = 
[
    //Sheet 1: Nodes
    {
      'name': {
        prop: 'name',
        type: String
      }
    },
    //Sheet 2: Links
    {
        'source': {
          prop: 'source',
          type: String
        },
        'target': {
            prop: 'target',
            type: String,
        },
        'value': {
            prop: 'value',
            type: Number
        }	
    },
]



	//log('LINK:', LINK)
	fetch(XLS_FILE)
		.then(response => response.blob())
		.then(blob => 
      Promise.all ([
        readXlsxFile(blob, {sheet:1, schema: SCHEMAS[0] }),
        readXlsxFile(blob, {sheet:2, schema: SCHEMAS[1] }),
        
      ] )
      .then((rows ) => {
        data = rows;
        dataUnfiltered = data;
        const dataJSON = JSON.stringify(data);
        console.log(dataJSON)
      }));