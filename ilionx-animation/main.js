const INPUT_FILE = 'data/animation.xlsx'
const SCHEMAS =
  [
    //Sheet 1: Elements
    {
      'id': {
        prop: 'id',
        type: Number
      },

      'name': {
        prop: 'name',
        type: String,
      }
      ,
      'order': {
        prop: 'order',
        type: Number,
      }
      ,
      'type': {
        prop: 'type',
        type: String,
      }
      ,
      'operation': {
        prop: 'operation',
        type: String,
      }
      ,
      'element': {
        prop: 'element',
        type: String,
      }
      ,
      'elementValue': {
        prop: 'elementValue',
        type: String,
      }
      ,
      'parentId': {
        prop: 'parentId',
        type: Number,
      }
      ,
      'parentName': {
        prop: 'parentName',
        type: String,
      }


    }    
,    //Sheet 2: Attributes
// id	attrKey	attrValue	elementId	elementName	elementElement
{
  'id': {
    prop: 'id',
    type: Number
  },

  'attrKey': {
    prop: 'attrKey',
    type: String,
  }
  ,
  'attrValue': {
    prop: 'attrValue',
    type: String,
  }
  ,
  'elementId': {
    prop: 'elementId',
    type: Number,
  }
  ,
  'elementName': {
    prop: 'elementName',
    type: String,
  }
  ,
  'elementElement': {
    prop: 'elementElement',
    type: String,
  }
 



}    
,    //Sheet 3: Animations

{
  'id': {
    prop: 'id',
    type: Number
  },

  'include': {
    prop: 'include',
    type: Boolean
  },

  'elementId': {
    prop: 'elementId',
    type: Number
  },

  'elementName': {
    prop: 'elementName',
    type: String,
  }
  ,
  'order': {
    prop: 'order',
    type: Number,
  }
  ,
  'frame': {
    prop: 'frame',
    type: String,
  }
  ,
  'type': {
    prop: 'type',
    type: String,
  }
  ,
  'key': {
    prop: 'key',
    type: String,
  }
  ,
  'value': {
    prop: 'value',
    type: String,
  }
  ,
  'duration': {
    prop: 'duration',
    type: Number,
  }
  ,
  'delay': {
    prop: 'delay',
    type: Number,
  }
  ,
  'ease': {
    prop: 'ease',
    type: String,
  }


}    

  ]

const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const width = 1200;
const height = 800;
const svgStart = []
const ease = new Map()
ease.set("easeLinear", d3.easeLinear);
ease.set("easeBounceOut", d3.easeBounceOut);


const svg = d3.select('#viz')
  .append('svg')
  .attr('viewbox', `-500 0 ${width} ${height}` )
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', ` translate(${margin.left},${margin.top}) scale(0.7)`)
  .attr('overflow', "visible")
  ;


  const logoText = ['wij zijn ilionx', 'experts', 'in eenvoud']
  
function createSVG(elements, attributes){

  elements
  .sort((a, b) =>{ 
    return a.order - b.order;})
  .forEach((d, i) => {
    
    //CREATE ELEMENT
    const e = d3.create(`svg:${d.element}`).attr('id', `e${d.id}`)
    // console.log('elementValue', d.elementValue)
    if (d.elementValue) {
      if (d.element == 'text') {
      // console.log('element', d, i)
      e.text(d.elementValue)
    }
  }

    //SET ATTRIBUTES 
    const elementAttributes = attributes.filter(a => a.elementId === d.id)
    elementAttributes.forEach((a, j) => {
      // console.log('attribute', a, j)
      d3.select(e.node()).attr(a.attrKey, a.attrValue)
    })

    
    
    svgStart.push(e)
    
    //ADD ELEMENT TO PARENT IF THERE IS ONE
    if (d.parentId) {
      // console.log('element has parent, appending to parent', d      )
      d3.select(`#e${d.parentId}`).append(() => e.node())

    }
    else     {
      // console.log('element has no parent, appending to svg root', d)
      svg.append(() => e.node());
    }

  })
  


  return 

}

function runAnimations (animations) {

  animations
    .filter(a => a.include)
    .sort((a, b) =>{ 
    return a.order - b.order;}).forEach((a, i) => {
    d3.timeout(
      elapsed => {
      runElementAnimation(a, elapsed)
  }
  , a.delay * 1000 || 1000)
  })
  return
}

function runElementAnimation (a, elapsed) {
  // console.log('runElementAnimation', a)
  d3.select(`#e${a.elementId}`)
    .transition()
    .duration(a.duration * 1000)
    
    .ease(a.ease ? ease.get(a.ease): d3.easeLinear)
    .attr(a.key, a.value)
  

  return

}

function main () {


  let dataElementsUnfiltered = {};
  let dataAnimationsUnfiltered = {};
  let dataAttributesUnfiltered = {};
  let promiseList = [];

  promiseList.push(fetch(INPUT_FILE).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 1, schema: SCHEMAS[0] }).then((resolve, reject) => { dataElementsUnfiltered   = resolve.rows;   })))  
  promiseList.push(fetch(INPUT_FILE).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 2, schema: SCHEMAS[1] }).then((resolve, reject) => { dataAttributesUnfiltered = resolve.rows;   })))  
  promiseList.push(fetch(INPUT_FILE).then(response => response.blob()).then(blob => readXlsxFile(blob, { sheet: 3, schema: SCHEMAS[2] }).then((resolve, reject) => { dataAnimationsUnfiltered = resolve.rows;   })))  
  
     // console.log('reject',reject, resolve)     
  Promise.all(promiseList)
    .then((resolve, reject) => {
     
      
      const dataElementsFiltered    = dataElementsUnfiltered
      const dataAttributesFiltered  = dataAttributesUnfiltered
      const dataAnimationsFiltered  = dataAnimationsUnfiltered

      createSVG(dataElementsFiltered, dataAttributesFiltered)
      
      // console.log(dataAnimationsFiltered)
      runAnimations(dataAnimationsFiltered)



})
  

  return

}

main()