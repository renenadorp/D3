// https://observablehq.com/@xianwu/force-directed-graph-network-graph-with-arrowheads-and-lab
const width = 2500;
const height = 2500;
const margin ={left: 10, right: 10, top: 10, bottom: 10}
colorScale = d3.scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
    .domain(["Transaction", "Reference"])
    .range(['#ff9e6d', '#86cbff', '#c2e5a0','#fff686','#9e79db'])


  //create a simulation for an array of nodes, and compose the desired forces.
simulation = d3.forceSimulation()
    .force("link", d3.forceLink() // This force provides links between nodes
                    .id(d => d.id) // This sets the node id accessor to the specified function. If not specified, will default to the index of a node.
                    .distance(130)
     ) 
    .force("charge", d3.forceManyBody().strength(-50)) // This adds repulsion (if it's negative) between nodes. 
    .force("center", d3.forceCenter(width / 2, height / 2)); // This force attracts nodes to the center of the svg area    

const svg = d3.select("#viz").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        // .attr("height", height)
        // .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        // .append("g")
        // .attr("transform", `translate(${margin.left},${margin.top})`);
    
   //appending little triangles, path object, as arrowhead
  //The <defs> element is used to store graphical objects that will be used at a later time
  //The <marker> element defines the graphic that is to be used for drawing arrowheads or polymarkers on a given <path>, <line>, <polyline> or <polygon> element.
  svg.append('defs').append('marker')
      .attr("id",'arrowhead')
      .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
       .attr('refX',23) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
       .attr('refY',0)
       .attr('orient','auto')
          .attr('markerWidth',13)
          .attr('markerHeight',13)
          .attr('xoverflow','visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke','none');
    
  //create some data


  const dataset = {
    "nodes": [
        {
            "id": "BA_ACCOUNTSPAYABLE",
            "name": "BA_ACCOUNTSPAYABLE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_ACCOUNTSRECEIVABLE",
            "name": "BA_ACCOUNTSRECEIVABLE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_ACTIVITY",
            "name": "BA_ACTIVITY",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_ACTIVITYPARTYROLE",
            "name": "BA_ACTIVITYPARTYROLE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_ACTIVITYROLE",
            "name": "BA_ACTIVITYROLE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_ADDRESSBUSINESSTYPE",
            "name": "BA_ADDRESSBUSINESSTYPE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_APPOINTMENT",
            "name": "BA_APPOINTMENT",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_CAMPAIGNACTIVITY",
            "name": "BA_CAMPAIGNACTIVITY",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_CASE",
            "name": "BA_CASE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_CASELOG",
            "name": "BA_CASELOG",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_CHARGE",
            "name": "BA_CHARGE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_CHARGE_BACKUP_DUPS_TABLE_20220824",
            "name": "BA_CHARGE_BACKUP_DUPS_TABLE_20220824",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_CONTRACTCOST",
            "name": "BA_CONTRACTCOST",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_CURRENCY",
            "name": "BA_CURRENCY",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_CUSTOMERBUSINESSTYPECONTACTRELATION",
            "name": "BA_CUSTOMERBUSINESSTYPECONTACTRELATION",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_DQ_RULE_RESULT",
            "name": "BA_DQ_RULE_RESULT",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_DQ_TAGASSOCIATION",
            "name": "BA_DQ_TAGASSOCIATION",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_EMAIL",
            "name": "BA_EMAIL",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_EXCHANGERATE",
            "name": "BA_EXCHANGERATE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_FINANCIALJOURNAL",
            "name": "BA_FINANCIALJOURNAL",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_GL_TRANSACTION",
            "name": "BA_GL_TRANSACTION",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_GL_TRANSACTIONBUDGET",
            "name": "BA_GL_TRANSACTIONBUDGET",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_INVENTORYADJUSTMENT",
            "name": "BA_INVENTORYADJUSTMENT",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_INVENTORYAGING",
            "name": "BA_INVENTORYAGING",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_INVENTORYTRANSACTION",
            "name": "BA_INVENTORYTRANSACTION",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_INVENTORYTRANSACTIONSETTLEMENT",
            "name": "BA_INVENTORYTRANSACTIONSETTLEMENT",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_ITEMORDERSETTING",
            "name": "BA_ITEMORDERSETTING",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_LEAD",
            "name": "BA_LEAD",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_LEADPRODUCT",
            "name": "BA_LEADPRODUCT",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_MAINTENANCEORDER",
            "name": "BA_MAINTENANCEORDER",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_MARKETINTELLIGENCE",
            "name": "BA_MARKETINTELLIGENCE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_MEETINGREPORT",
            "name": "BA_MEETINGREPORT",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_OPPORTUNITY",
            "name": "BA_OPPORTUNITY",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_PHONECALL",
            "name": "BA_PHONECALL",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_PRODUCTDEVELOPMENT",
            "name": "BA_PRODUCTDEVELOPMENT",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_PRODUCTIONORDER",
            "name": "BA_PRODUCTIONORDER",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_PRODUCTIONORDERBOM",
            "name": "BA_PRODUCTIONORDERBOM",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_PRODUCTIONTRANSACTION_ACTUAL",
            "name": "BA_PRODUCTIONTRANSACTION_ACTUAL",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_PRODUCTIONTRANSACTION_ESTIMATE",
            "name": "BA_PRODUCTIONTRANSACTION_ESTIMATE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_PURCHASECONTRACT",
            "name": "BA_PURCHASECONTRACT",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_PURCHASEORDER",
            "name": "BA_PURCHASEORDER",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_PURCHASEORDERCONFIRMATION",
            "name": "BA_PURCHASEORDERCONFIRMATION",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_PURCHASEORDERINVOICE",
            "name": "BA_PURCHASEORDERINVOICE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_PURCHASEORDERSETTLEMENT",
            "name": "BA_PURCHASEORDERSETTLEMENT",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_PURCHASEPACKINGSLIP",
            "name": "BA_PURCHASEPACKINGSLIP",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_QUALITYORDER",
            "name": "BA_QUALITYORDER",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_QUALITYORDERRESULT",
            "name": "BA_QUALITYORDERRESULT",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_QUOTE",
            "name": "BA_QUOTE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_RETURNABLEPACKAGING",
            "name": "BA_RETURNABLEPACKAGING",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_SALESCONTRACTLINEBREAKDOWN",
            "name": "BA_SALESCONTRACTLINEBREAKDOWN",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_SALESCOSTADJUSTMENT",
            "name": "BA_SALESCOSTADJUSTMENT",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_SALESORDER",
            "name": "BA_SALESORDER",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_SALESORDERCONFIRMATION",
            "name": "BA_SALESORDERCONFIRMATION",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_SALESORDERINVOICE",
            "name": "BA_SALESORDERINVOICE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_SALESORDERSETTLEMENT",
            "name": "BA_SALESORDERSETTLEMENT",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_SALESORDER_BACKUP_DUPS_TABLE_20220824",
            "name": "BA_SALESORDER_BACKUP_DUPS_TABLE_20220824",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_SALESPACKINGSLIP",
            "name": "BA_SALESPACKINGSLIP",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_SHIPMENT",
            "name": "BA_SHIPMENT",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_SUPPLIERBATCHFACTOR",
            "name": "BA_SUPPLIERBATCHFACTOR",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_SUPPLIERBUSINESSTYPECONTACTRELATION",
            "name": "BA_SUPPLIERBUSINESSTYPECONTACTRELATION",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_TRANSFERORDER",
            "name": "BA_TRANSFERORDER",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_TRANSPORTNOTE",
            "name": "BA_TRANSPORTNOTE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BA_WAREHOUSEACTIVITY",
            "name": "BA_WAREHOUSEACTIVITY",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "BV_ACCOUNTMANAGERMATRIX",
            "name": "BV_ACCOUNTMANAGERMATRIX",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_ADDRESS",
            "name": "BV_ADDRESS",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_ALLERGEN",
            "name": "BV_ALLERGEN",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_APPROVEDPRODUCER",
            "name": "BV_APPROVEDPRODUCER",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_APPROVEDSUPPLIER",
            "name": "BV_APPROVEDSUPPLIER",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_BILLOFMATERIAL",
            "name": "BV_BILLOFMATERIAL",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_BRANCH",
            "name": "BV_BRANCH",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_BRAND",
            "name": "BV_BRAND",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_BUSINESSTERM",
            "name": "BV_BUSINESSTERM",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_BUSINESSTYPE",
            "name": "BV_BUSINESSTYPE",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_CAG",
            "name": "BV_CAG",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_CAMPAIGN",
            "name": "BV_CAMPAIGN",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_CASEASSOCIATION",
            "name": "BV_CASEASSOCIATION",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_CASHDISCOUNT",
            "name": "BV_CASHDISCOUNT",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_CHAIN",
            "name": "BV_CHAIN",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_CHARGETYPE",
            "name": "BV_CHARGETYPE",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_COMPANY",
            "name": "BV_COMPANY",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_COMPANYCALENDAR",
            "name": "BV_COMPANYCALENDAR",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_COMPETITOR",
            "name": "BV_COMPETITOR",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_CONTACTINFO",
            "name": "BV_CONTACTINFO",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_CONTACTPERSON",
            "name": "BV_CONTACTPERSON",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_CONTACTTYPE",
            "name": "BV_CONTACTTYPE",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_CONTRACTRELATION",
            "name": "BV_CONTRACTRELATION",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_COSTCENTER",
            "name": "BV_COSTCENTER",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_COUNTRY",
            "name": "BV_COUNTRY",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_CUSTOMER",
            "name": "BV_CUSTOMER",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_CUSTOMERBANKACCOUNT",
            "name": "BV_CUSTOMERBANKACCOUNT",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_DELIVERYTERM",
            "name": "BV_DELIVERYTERM",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_DIGITALASSET",
            "name": "BV_DIGITALASSET",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_DIGITALASSETTYPE",
            "name": "BV_DIGITALASSETTYPE",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_DIVISION",
            "name": "BV_DIVISION",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_DQ_DIMENSION",
            "name": "BV_DQ_DIMENSION",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_DQ_RULE",
            "name": "BV_DQ_RULE",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_DQ_TAG",
            "name": "BV_DQ_TAG",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_EMPLOYEE",
            "name": "BV_EMPLOYEE",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_EMPLOYMENT",
            "name": "BV_EMPLOYMENT",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_EXCEPTIONMARGIN",
            "name": "BV_EXCEPTIONMARGIN",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_EXTERNALITEMCUSTOMERSUPPLIER",
            "name": "BV_EXTERNALITEMCUSTOMERSUPPLIER",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_FINANCIALREPORTINGORGANISATION",
            "name": "BV_FINANCIALREPORTINGORGANISATION",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_GL_ACCOUNT",
            "name": "BV_GL_ACCOUNT",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_GL_ORDER",
            "name": "BV_GL_ORDER",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_GTINCATEGORY",
            "name": "BV_GTINCATEGORY",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_INVENTORYBATCHSTATUS",
            "name": "BV_INVENTORYBATCHSTATUS",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_INVENTORYSTATUS",
            "name": "BV_INVENTORYSTATUS",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_ITEM",
            "name": "BV_ITEM",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_ITEMALLERGENRELATION",
            "name": "BV_ITEMALLERGENRELATION",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_ITEMPRECURSORRELATION",
            "name": "BV_ITEMPRECURSORRELATION",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_KEYACCOUNT",
            "name": "BV_KEYACCOUNT",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_MAINITEM",
            "name": "BV_MAINITEM",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_MAINITEMNOTE",
            "name": "BV_MAINITEMNOTE",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_MAINITEMTRANSLATION",
            "name": "BV_MAINITEMTRANSLATION",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_NONRECURRING",
            "name": "BV_NONRECURRING",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_PAYMENTTERM",
            "name": "BV_PAYMENTTERM",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_PRECURSOR",
            "name": "BV_PRECURSOR",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_PRODUCTGROUP",
            "name": "BV_PRODUCTGROUP",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_PRODUCTIONGROUP",
            "name": "BV_PRODUCTIONGROUP",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_PRODUCTIONPOOL",
            "name": "BV_PRODUCTIONPOOL",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_PURCHASECONTRACTPURCHASEORDERRELATION",
            "name": "BV_PURCHASECONTRACTPURCHASEORDERRELATION",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_PURCHASETRADEAGREEMENT",
            "name": "BV_PURCHASETRADEAGREEMENT",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_PURPOSE",
            "name": "BV_PURPOSE",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_REPORTINGMODEL",
            "name": "BV_REPORTINGMODEL",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_SALESBUDGET",
            "name": "BV_SALESBUDGET",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_SALESCONTRACT",
            "name": "BV_SALESCONTRACT",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_SALESCONTRACTSALESORDERRELATION",
            "name": "BV_SALESCONTRACTSALESORDERRELATION",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_SALESTRADEAGREEMENT",
            "name": "BV_SALESTRADEAGREEMENT",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_SAMPLEREQUEST",
            "name": "BV_SAMPLEREQUEST",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_SITE",
            "name": "BV_SITE",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_SUPPLIER",
            "name": "BV_SUPPLIER",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_SUPPLIERBANKACCOUNT",
            "name": "BV_SUPPLIERBANKACCOUNT",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_TABLE",
            "name": "BV_TABLE",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_TARGETPRICINGENGINE",
            "name": "BV_TARGETPRICINGENGINE",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_TAXBRANCH",
            "name": "BV_TAXBRANCH",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_TRANSACTIONTYPE",
            "name": "BV_TRANSACTIONTYPE",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_UNITOFMEASURE",
            "name": "BV_UNITOFMEASURE",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_UNITOFMEASURECONVERSION",
            "name": "BV_UNITOFMEASURECONVERSION",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_WAREHOUSE",
            "name": "BV_WAREHOUSE",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "BV_WAREHOUSELOCATION",
            "name": "BV_WAREHOUSELOCATION",
            "label": "label",
            "group": "Transaction",
            "runtime": 0
        },
        {
            "id": "IT_AGGREGATED_COGS_ORDERS",
            "name": "IT_AGGREGATED_COGS_ORDERS",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_AGGREGATED_COGS_PURCHASEORDERS",
            "name": "IT_AGGREGATED_COGS_PURCHASEORDERS",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_AGGREGATED_TURNOVER_ORDERS",
            "name": "IT_AGGREGATED_TURNOVER_ORDERS",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_CHARGE_PURCHASE",
            "name": "IT_CHARGE_PURCHASE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_CHARGE_SALES",
            "name": "IT_CHARGE_SALES",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_CONTRACT_INVENTORYTRANSACTION_COGS",
            "name": "IT_CONTRACT_INVENTORYTRANSACTION_COGS",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_INVENTORYTRANSACTIONSETTLEMENT_COGS",
            "name": "IT_INVENTORYTRANSACTIONSETTLEMENT_COGS",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_INVENTORYTRANSACTIONSETTLEMENT_FINANCIALCOGS",
            "name": "IT_INVENTORYTRANSACTIONSETTLEMENT_FINANCIALCOGS",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_INVENTORYTRANSACTIONSETTLEMENT_PURCHASEVALUEADJ",
            "name": "IT_INVENTORYTRANSACTIONSETTLEMENT_PURCHASEVALUEADJ",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_INVENTORYTRANSACTION_APPLIED_MANUFACTURING_COST",
            "name": "IT_INVENTORYTRANSACTION_APPLIED_MANUFACTURING_COST",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_INVENTORYTRANSACTION_FINANCIALCOGS",
            "name": "IT_INVENTORYTRANSACTION_FINANCIALCOGS",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_INVENTORYTRANSACTION_PURCHASEVALUE",
            "name": "IT_INVENTORYTRANSACTION_PURCHASEVALUE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_INVENTORYTRANSACTION_WITH_SETTLEMENTS",
            "name": "IT_INVENTORYTRANSACTION_WITH_SETTLEMENTS",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_INVENTORY_SNAPSHOT",
            "name": "IT_INVENTORY_SNAPSHOT",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_OPEN_PURCHASEORDER_PURCHASEVALUE",
            "name": "IT_OPEN_PURCHASEORDER_PURCHASEVALUE",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_OPEN_SALESORDER_COGS",
            "name": "IT_OPEN_SALESORDER_COGS",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_OPEN_SALESORDER_ORDERED_QUANTITY",
            "name": "IT_OPEN_SALESORDER_ORDERED_QUANTITY",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_OPEN_SALESORDER_TURNOVER",
            "name": "IT_OPEN_SALESORDER_TURNOVER",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        },
        {
            "id": "IT_SALESORDERINVOICE_TURNOVER",
            "name": "IT_SALESORDERINVOICE_TURNOVER",
            "label": "label",
            "group": "Reference",
            "runtime": 0
        }
    ],
    "links": [
        {
            "source": "BA_ACCOUNTSPAYABLE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_ACCOUNTSPAYABLE_BA_CURRENCY_LCY"
        },
        {
            "source": "BA_ACCOUNTSPAYABLE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_ACCOUNTSPAYABLE_BA_CURRENCY_TCY"
        },
        {
            "source": "BA_ACCOUNTSPAYABLE",
            "target": "BV_COMPANY",
            "type": "FK_BA_ACCOUNTSPAYABLE_BV_COMPANY"
        },
        {
            "source": "BA_ACCOUNTSPAYABLE",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_ACCOUNTSPAYABLE_BV_PAYMENTTERM"
        },
        {
            "source": "BA_ACCOUNTSPAYABLE",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_ACCOUNTSPAYABLE_BV_SUPPLIER"
        },
        {
            "source": "BA_ACCOUNTSRECEIVABLE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_ACCOUNTSRECEIVABLE_BA_CURRENCY_LCY"
        },
        {
            "source": "BA_ACCOUNTSRECEIVABLE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_ACCOUNTSRECEIVABLE_BA_CURRENCY_TCY"
        },
        {
            "source": "BA_ACCOUNTSRECEIVABLE",
            "target": "BV_COMPANY",
            "type": "FK_BA_ACCOUNTSRECEIVABLE_BV_COMPANY"
        },
        {
            "source": "BA_ACCOUNTSRECEIVABLE",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_ACCOUNTSRECEIVABLE_BV_CUSTOMER"
        },
        {
            "source": "BA_ACCOUNTSRECEIVABLE",
            "target": "BV_PAYMENTTERM",
            "type": "FK_BA_ACCOUNTSRECEIVABLE_BV_EMPLOYEE_EXTERNAL_SALES_PERSON"
        },
        {
            "source": "BA_ACCOUNTSRECEIVABLE",
            "target": "BV_PAYMENTTERM",
            "type": "FK_BA_ACCOUNTSRECEIVABLE_BV_PAYMENTTERM"
        },
        {
            "source": "BA_ACTIVITY",
            "target": "BA_CASE",
            "type": "FK_BA_ACTIVITY_BA_CASE_KEY"
        },
        {
            "source": "BA_ACTIVITY",
            "target": "BA_LEAD",
            "type": "FK_BA_ACTIVITY_BA_LEAD_KEY"
        },
        {
            "source": "BA_ACTIVITY",
            "target": "BA_LEADPRODUCT",
            "type": "FK_BA_ACTIVITY_BA_LEADPRODUCT_KEY"
        },
        {
            "source": "BA_ACTIVITY",
            "target": "BA_OPPORTUNITY",
            "type": "FK_BA_ACTIVITY_BA_OPPORTUNITY_KEY"
        },
        {
            "source": "BA_ACTIVITY",
            "target": "BA_QUOTE",
            "type": "FK_BA_ACTIVITY_BA_QUOTE_KEY"
        },
        {
            "source": "BA_ACTIVITY",
            "target": "BV_CAMPAIGN",
            "type": "FK_BA_ACTIVITY_BV_CAMPAIGN"
        },
        {
            "source": "BA_ACTIVITY",
            "target": "BV_COMPANY",
            "type": "FK_BA_ACTIVITY_BV_COMPANY_KEY"
        },
        {
            "source": "BA_ACTIVITY",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_ACTIVITY_BV_CUSTOMER_KEY"
        },
        {
            "source": "BA_ACTIVITY",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_ACTIVITY_BV_EMPLOYEE_KEY"
        },
        {
            "source": "BA_ACTIVITY",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_ACTIVITY_BV_ITEM_KEY"
        },
        {
            "source": "BA_ACTIVITY",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_ACTIVITY_BV_MAINITEM_KEY"
        },
        {
            "source": "BA_ACTIVITY",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_ACTIVITY_BV_SAMPLEREQUEST_KEY"
        },
        {
            "source": "BA_ACTIVITY",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_ACTIVITY_BV_SUPPLIER_KEY"
        },
        {
            "source": "BA_ACTIVITYPARTYROLE",
            "target": "BA_ACTIVITY",
            "type": "FK_BA_ACTIVITYPARTYROLE_BA_ACTIVITY"
        },
        {
            "source": "BA_ACTIVITYPARTYROLE",
            "target": "BV_CONTACTINFO",
            "type": "FK_BA_ACTIVITYPARTYROLE_BV_CONTACTINFO"
        },
        {
            "source": "BA_ACTIVITYPARTYROLE",
            "target": "BV_CONTACTPERSON",
            "type": "FK_BA_ACTIVITYPARTYROLE_BV_CONTACTPERSON"
        },
        {
            "source": "BA_ACTIVITYPARTYROLE",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_ACTIVITYPARTYROLE_BV_CUSTOMER"
        },
        {
            "source": "BA_ACTIVITYPARTYROLE",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_ACTIVITYPARTYROLE_BV_EMPLOYEE"
        },
        {
            "source": "BA_ACTIVITYPARTYROLE",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_ACTIVITYPARTYROLE_BV_SUPPLIER"
        },
        {
            "source": "BA_ADDRESSBUSINESSTYPE",
            "target": "BV_ADDRESS",
            "type": "FK_BA_ADDRESSBUSINESSTYPE_BV_ADDRESS"
        },
        {
            "source": "BA_ADDRESSBUSINESSTYPE",
            "target": "BV_BUSINESSTYPE",
            "type": "FK_BA_ADDRESSBUSINESSTYPE_BV_BUSINESSTYPE"
        },
        {
            "source": "BA_ADDRESSBUSINESSTYPE",
            "target": "BV_CONTACTPERSON",
            "type": "FK_BA_ADDRESSBUSINESSTYPE_BV_CONTACTPERSON"
        },
        {
            "source": "BA_ADDRESSBUSINESSTYPE",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_ADDRESSBUSINESSTYPE_BV_CUSTOMER"
        },
        {
            "source": "BA_ADDRESSBUSINESSTYPE",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_ADDRESSBUSINESSTYPE_BV_SUPPLIER"
        },
        {
            "source": "BA_CAMPAIGNACTIVITY",
            "target": "BA_ACTIVITY",
            "type": "FK_BA_CAMPAIGNACTIVITY_BA_ACTIVITY"
        },
        {
            "source": "BA_CAMPAIGNACTIVITY",
            "target": "BV_COMPANY",
            "type": "FK_BA_CAMPAIGNACTIVITY_BV_COMPANY"
        },
        {
            "source": "BA_CAMPAIGNACTIVITY",
            "target": "BV_EMPLOYEE",
            "type": "FK_BA_CAMPAIGNACTIVITY_BV_EMPLOYEE_OWNER"
        },
        {
            "source": "BA_CASE",
            "target": "BA_CASE",
            "type": "FK_BA_CASE_BA_CASE_KEY_PARENT"
        },
        {
            "source": "BA_CASE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_CASE_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_CASE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_CASE_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_CASE",
            "target": "BV_COMPANY",
            "type": "FK_BA_CASE_BV_COMPANY"
        },
        {
            "source": "BA_CASE",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_CASE_BV_CUSTOMER"
        },
        {
            "source": "BA_CASE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_CASE_BV_EMPLOYEE_KEY_MODIFIEDBY"
        },
        {
            "source": "BA_CASE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_CASE_BV_EMPLOYEE_KEY_CLOSEDBY"
        },
        {
            "source": "BA_CASE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_CASE_BV_EMPLOYEE_KEY_SALES_RESPONSIBLE"
        },
        {
            "source": "BA_CASE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_CASE_BV_EMPLOYEE_KEY_RESPONSIBLE"
        },
        {
            "source": "BA_CASE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_CASE_BV_EMPLOYEE_KEY_CREATEDBY"
        },
        {
            "source": "BA_CASE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_CASE_BV_SUPPLIER"
        },
        {
            "source": "BA_CASE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_CASE_BV_SUPPLIER_KEY_CARRIER"
        },
        {
            "source": "BA_CASE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_CASE_BV_WAREHOUSE"
        },
        {
            "source": "BA_CASELOG",
            "target": "BA_ACTIVITY",
            "type": "FK_BA_CASELOG_BA_ACTIVITY"
        },
        {
            "source": "BA_CASELOG",
            "target": "BA_CASE",
            "type": "FK_BA_CASELOG_BA_CASE"
        },
        {
            "source": "BA_CASELOG",
            "target": "BV_COMPANY",
            "type": "FK_BA_CASELOG_BV_COMPANY"
        },
        {
            "source": "BA_CASELOG",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_CASELOG_BV_CUSTOMER"
        },
        {
            "source": "BA_CASELOG",
            "target": "BV_EMPLOYEE",
            "type": "FK_BA_CASELOG_BV_EMPLOYEE_OWNER"
        },
        {
            "source": "BA_CHARGE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_CHARGE_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_CHARGE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_CHARGE_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_CHARGE",
            "target": "BA_PURCHASECONTRACT",
            "type": "FK_BA_CHARGE_BA_PURCHASECONTRACT"
        },
        {
            "source": "BA_CHARGE",
            "target": "BA_PURCHASEORDER",
            "type": "FK_BA_CHARGE_BA_PURCHASEORDER"
        },
        {
            "source": "BA_CHARGE",
            "target": "BA_SALESORDER",
            "type": "FK_BA_CHARGE_BA_SALESORDER"
        },
        {
            "source": "BA_CHARGE",
            "target": "BV_CHARGETYPE",
            "type": "FK_BA_CHARGE_BV_CHARGETYPE"
        },
        {
            "source": "BA_CHARGE",
            "target": "BV_COMPANY",
            "type": "FK_BA_CHARGE_BV_COMPANY"
        },
        {
            "source": "BA_CHARGE",
            "target": "BV_ITEM",
            "type": "FK_BA_CHARGE_BV_ITEM"
        },
        {
            "source": "BA_CONTRACTCOST",
            "target": "BA_CURRENCY",
            "type": "FK_BA_CONTRACTCOST_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_CONTRACTCOST",
            "target": "BA_CURRENCY",
            "type": "FK_BA_CONTRACTCOST_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_CONTRACTCOST",
            "target": "BA_INVENTORYTRANSACTION",
            "type": "FK_BA_CONTRACTCOST_BA_INVENTORYTRANSACTION"
        },
        {
            "source": "BA_CONTRACTCOST",
            "target": "BA_SALESORDER",
            "type": "FK_BA_CONTRACTCOST_BA_SALESORDER"
        },
        {
            "source": "BA_CONTRACTCOST",
            "target": "BV_COMPANY",
            "type": "FK_BA_CONTRACTCOST_BV_COMPANY"
        },
        {
            "source": "BA_CONTRACTCOST",
            "target": "BV_ITEM",
            "type": "FK_BA_CONTRACTCOST_BV_ITEM"
        },
        {
            "source": "BA_CUSTOMERBUSINESSTYPECONTACTRELATION",
            "target": "BV_BUSINESSTYPE",
            "type": "FK_BA_CUSTOMERBUSINESSTYPECONTACTRELATION_BV_BUSINESSTYPE"
        },
        {
            "source": "BA_CUSTOMERBUSINESSTYPECONTACTRELATION",
            "target": "BV_COMPANY",
            "type": "FK_BA_CUSTOMERBUSINESSTYPECONTACTRELATION_BV_COMPANY"
        },
        {
            "source": "BA_CUSTOMERBUSINESSTYPECONTACTRELATION",
            "target": "BV_CONTACTINFO",
            "type": "FK_BA_CUSTOMERBUSINESSTYPECONTACTRELATION_BV_CONTACTINFO"
        },
        {
            "source": "BA_CUSTOMERBUSINESSTYPECONTACTRELATION",
            "target": "BV_CONTACTPERSON",
            "type": "FK_BA_CUSTOMERBUSINESSTYPECONTACTRELATION_BV_CONTACTPERSON"
        },
        {
            "source": "BA_CUSTOMERBUSINESSTYPECONTACTRELATION",
            "target": "BV_CONTACTTYPE",
            "type": "FK_BA_CUSTOMERBUSINESSTYPECONTACTRELATION_BV_CONTACTTYPE"
        },
        {
            "source": "BA_CUSTOMERBUSINESSTYPECONTACTRELATION",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_CUSTOMERBUSINESSTYPECONTACTRELATION_BV_CUSTOMER"
        },
        {
            "source": "BA_DQ_RULE_RESULT",
            "target": "BV_BUSINESSTERM",
            "type": "FK_BA_DQ_RULE_RESULT_BV_BUSINESSTERM"
        },
        {
            "source": "BA_DQ_RULE_RESULT",
            "target": "BV_COMPANY",
            "type": "FK_BA_DQ_RULE_RESULT_BV_COMPANY"
        },
        {
            "source": "BA_DQ_RULE_RESULT",
            "target": "BV_DQ_RULE",
            "type": "FK_BA_DQ_RULE_RESULT_BV_DQ_RULE"
        },
        {
            "source": "BA_DQ_RULE_RESULT",
            "target": "BV_EMPLOYEE",
            "type": "FK_BA_DQ_RULE_RESULT_BV_EMPLOYEE_KEY_DATA_OWNER"
        },
        {
            "source": "BA_DQ_RULE_RESULT",
            "target": "BV_EMPLOYEE",
            "type": "FK_BA_DQ_RULE_RESULT_BV_EMPLOYEE_KEY_DATA_STEWARD"
        },
        {
            "source": "BA_DQ_TAGASSOCIATION",
            "target": "BV_DQ_RULE",
            "type": "FK_BA_DQ_TAGASSOCIATION_BV_DQ_RULE"
        },
        {
            "source": "BA_DQ_TAGASSOCIATION",
            "target": "BV_DQ_TAG",
            "type": "FK_BA_DQ_TAGASSOCIATION_BV_DQ_TAG"
        },
        {
            "source": "BA_EMAIL",
            "target": "BA_ACTIVITY",
            "type": "FK_BA_EMAIL_BA_ACTIVITY"
        },
        {
            "source": "BA_EMAIL",
            "target": "BA_ACTIVITY",
            "type": "FK_BA_EMAIL_BA_ACTIVITY_PARENT"
        },
        {
            "source": "BA_EMAIL",
            "target": "BA_CASE",
            "type": "FK_BA_EMAIL_BA_CASE"
        },
        {
            "source": "BA_EMAIL",
            "target": "BA_LEAD",
            "type": "FK_BA_EMAIL_BA_LEAD"
        },
        {
            "source": "BA_EMAIL",
            "target": "BA_OPPORTUNITY",
            "type": "FK_BA_EMAIL_BA_OPPORTUNITY"
        },
        {
            "source": "BA_EMAIL",
            "target": "BA_QUOTE",
            "type": "FK_BA_EMAIL_BA_QUOTE"
        },
        {
            "source": "BA_EMAIL",
            "target": "BV_COMPANY",
            "type": "FK_BA_EMAIL_BV_COMPANY"
        },
        {
            "source": "BA_EMAIL",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_EMAIL_BV_CUSTOMER"
        },
        {
            "source": "BA_EMAIL",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_EMAIL_BV_EMPLOYEE_OWNER"
        },
        {
            "source": "BA_EMAIL",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_EMAIL_BV_ITEM"
        },
        {
            "source": "BA_EMAIL",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_EMAIL_BV_MAINITEM"
        },
        {
            "source": "BA_EMAIL",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_EMAIL_BV_SAMPLEREQUEST"
        },
        {
            "source": "BA_EMAIL",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_EMAIL_BV_SUPPLIER"
        },
        {
            "source": "BA_EXCHANGERATE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_EXCHANGERATE_BA_CURRENCY_KEY_FROM"
        },
        {
            "source": "BA_EXCHANGERATE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_EXCHANGERATE_BA_CURRENCY_KEY_TO"
        },
        {
            "source": "BA_FINANCIALJOURNAL",
            "target": "BA_CURRENCY",
            "type": "FK_BA_FINANCIALJOURNAL_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_FINANCIALJOURNAL",
            "target": "BA_CURRENCY",
            "type": "FK_BA_FINANCIALJOURNAL_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_FINANCIALJOURNAL",
            "target": "BV_COMPANY",
            "type": "FK_BA_FINANCIALJOURNAL_BV_COMPANY"
        },
        {
            "source": "BA_FINANCIALJOURNAL",
            "target": "BV_COSTCENTER",
            "type": "FK_BA_FINANCIALJOURNAL_BV_COSTCENTER"
        },
        {
            "source": "BA_FINANCIALJOURNAL",
            "target": "BV_DIVISION",
            "type": "FK_BA_FINANCIALJOURNAL_BV_DIVISION"
        },
        {
            "source": "BA_FINANCIALJOURNAL",
            "target": "BV_GL_ACCOUNT",
            "type": "FK_BA_FINANCIALJOURNAL_BV_FINANCIALREPORTINGORGANISATION_KEY_BRG"
        },
        {
            "source": "BA_FINANCIALJOURNAL",
            "target": "BV_GL_ACCOUNT",
            "type": "FK_BA_FINANCIALJOURNAL_BV_GL_ACCOUNT_KEY_BRG"
        },
        {
            "source": "BA_GL_TRANSACTION",
            "target": "BA_CURRENCY",
            "type": "FK_BA_GL_TRANSACTION_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_GL_TRANSACTION",
            "target": "BA_CURRENCY",
            "type": "FK_BA_GL_TRANSACTION_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_GL_TRANSACTION",
            "target": "BV_CAG",
            "type": "FK_BA_GL_TRANSACTION_BV_CAG"
        },
        {
            "source": "BA_GL_TRANSACTION",
            "target": "BV_COMPANY",
            "type": "FK_BA_GL_TRANSACTION_BV_COMPANY"
        },
        {
            "source": "BA_GL_TRANSACTION",
            "target": "BV_COSTCENTER",
            "type": "FK_BA_GL_TRANSACTION_BV_COSTCENTER"
        },
        {
            "source": "BA_GL_TRANSACTION",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_GL_TRANSACTION_BV_CUSTOMER"
        },
        {
            "source": "BA_GL_TRANSACTION",
            "target": "BV_DIVISION",
            "type": "FK_BA_GL_TRANSACTION_BV_DIVISION"
        },
        {
            "source": "BA_GL_TRANSACTION",
            "target": "BV_TAXBRANCH",
            "type": "FK_BA_GL_TRANSACTION_BV_EMPLOYEE"
        },
        {
            "source": "BA_GL_TRANSACTION",
            "target": "BV_TAXBRANCH",
            "type": "FK_BA_GL_TRANSACTION_BV_GL_ACCOUNT"
        },
        {
            "source": "BA_GL_TRANSACTION",
            "target": "BV_TAXBRANCH",
            "type": "FK_BA_GL_TRANSACTION_BV_GL_ORDER"
        },
        {
            "source": "BA_GL_TRANSACTION",
            "target": "BV_TAXBRANCH",
            "type": "FK_BA_GL_TRANSACTION_BV_NONRECURRING"
        },
        {
            "source": "BA_GL_TRANSACTION",
            "target": "BV_TAXBRANCH",
            "type": "FK_BA_GL_TRANSACTION_BV_SUPPLIER"
        },
        {
            "source": "BA_GL_TRANSACTION",
            "target": "BV_TAXBRANCH",
            "type": "FK_BA_GL_TRANSACTION_BV_TAXBRANCH"
        },
        {
            "source": "BA_GL_TRANSACTIONBUDGET",
            "target": "BA_CURRENCY",
            "type": "FK_BA_GL_TRANSACTIONBUDGET_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_GL_TRANSACTIONBUDGET",
            "target": "BA_CURRENCY",
            "type": "FK_BA_GL_TRANSACTIONBUDGET_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_GL_TRANSACTIONBUDGET",
            "target": "BV_CAG",
            "type": "FK_BA_GL_TRANSACTIONBUDGET_BV_CAG"
        },
        {
            "source": "BA_GL_TRANSACTIONBUDGET",
            "target": "BV_COMPANY",
            "type": "FK_BA_GL_TRANSACTIONBUDGET_BV_COMPANY"
        },
        {
            "source": "BA_GL_TRANSACTIONBUDGET",
            "target": "BV_COSTCENTER",
            "type": "FK_BA_GL_TRANSACTIONBUDGET_BV_COSTCENTER"
        },
        {
            "source": "BA_GL_TRANSACTIONBUDGET",
            "target": "BV_DIVISION",
            "type": "FK_BA_GL_TRANSACTIONBUDGET_BV_DIVISION"
        },
        {
            "source": "BA_GL_TRANSACTIONBUDGET",
            "target": "BV_TAXBRANCH",
            "type": "FK_BA_GL_TRANSACTIONBUDGET_BV_GL_ACCOUNT"
        },
        {
            "source": "BA_GL_TRANSACTIONBUDGET",
            "target": "BV_TAXBRANCH",
            "type": "FK_BA_GL_TRANSACTIONBUDGET_BV_NONRECURRING"
        },
        {
            "source": "BA_GL_TRANSACTIONBUDGET",
            "target": "BV_TAXBRANCH",
            "type": "FK_BA_GL_TRANSACTIONBUDGET_BV_TAXBRANCH"
        },
        {
            "source": "BA_INVENTORYADJUSTMENT",
            "target": "BA_CURRENCY",
            "type": "FK_BA_INVENTORYADJUSTMENT_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_INVENTORYADJUSTMENT",
            "target": "BA_CURRENCY",
            "type": "FK_BA_INVENTORYADJUSTMENT_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_INVENTORYADJUSTMENT",
            "target": "BV_COMPANY",
            "type": "FK_BA_INVENTORYADJUSTMENT_BV_COMPANY"
        },
        {
            "source": "BA_INVENTORYADJUSTMENT",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYADJUSTMENT_BV_EMPLOYEE_KEY_WORKDONEBY"
        },
        {
            "source": "BA_INVENTORYADJUSTMENT",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYADJUSTMENT_BV_ITEM"
        },
        {
            "source": "BA_INVENTORYADJUSTMENT",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYADJUSTMENT_BV_SITE"
        },
        {
            "source": "BA_INVENTORYADJUSTMENT",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYADJUSTMENT_BV_UNITOFMEASURE"
        },
        {
            "source": "BA_INVENTORYADJUSTMENT",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYADJUSTMENT_BV_WAREHOUSE"
        },
        {
            "source": "BA_INVENTORYADJUSTMENT",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYADJUSTMENT_BV_WAREHOUSELOCATION"
        },
        {
            "source": "BA_INVENTORYAGING",
            "target": "BA_INVENTORYTRANSACTION",
            "type": "FK_BA_INVENTORYAGING_BA_INVENTORYTRANSACTION_KEY_LAST_RECEIPT"
        },
        {
            "source": "BA_INVENTORYAGING",
            "target": "BV_COMPANY",
            "type": "FK_BA_INVENTORYAGING_BV_COMPANY"
        },
        {
            "source": "BA_INVENTORYAGING",
            "target": "BV_ITEM",
            "type": "FK_BA_INVENTORYAGING_BV_ITEM"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BA_CURRENCY",
            "type": "FK_BA_INVENTORYTRANSACTION_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BA_CURRENCY",
            "type": "FK_BA_INVENTORYTRANSACTION_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BA_PRODUCTIONORDER",
            "type": "FK_BA_INVENTORYTRANSACTION_BA_PRODUCTIONORDER"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BA_PRODUCTIONORDERBOM",
            "type": "FK_BA_INVENTORYTRANSACTION_BA_PRODUCTIONORDERBOM"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BA_PURCHASEORDER",
            "type": "FK_BA_INVENTORYTRANSACTION_BA_PURCHASEORDER"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BA_SALESORDER",
            "type": "FK_BA_INVENTORYTRANSACTION_BA_SALESORDER"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BA_TRANSFERORDER",
            "type": "FK_BA_INVENTORYTRANSACTION_BA_TRANSFERORDER"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BV_COMPANY",
            "type": "FK_BA_INVENTORYTRANSACTION_BV_COMPANY"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYTRANSACTION_BV_INVENTORYBATCHSTATUS"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYTRANSACTION_BV_INVENTORYSTATUS"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYTRANSACTION_BV_ITEM"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYTRANSACTION_BV_SITE"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYTRANSACTION_BV_UNITOFMEASURE"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYTRANSACTION_BV_UNITOFMEASURE_KEY_PACKING"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYTRANSACTION_BV_UNITOFMEASURE_KEY_PURCHASE"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYTRANSACTION_BV_UNITOFMEASURE_KEY_SALES"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYTRANSACTION_BV_WAREHOUSE"
        },
        {
            "source": "BA_INVENTORYTRANSACTION",
            "target": "BV_WAREHOUSELOCATION",
            "type": "FK_BA_INVENTORYTRANSACTION_BV_WAREHOUSELOCATION"
        },
        {
            "source": "BA_INVENTORYTRANSACTIONSETTLEMENT",
            "target": "BA_CURRENCY",
            "type": "FK_BA_INVENTORYTRANSACTIONSETTLEMENT_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_INVENTORYTRANSACTIONSETTLEMENT",
            "target": "BA_CURRENCY",
            "type": "FK_BA_INVENTORYTRANSACTIONSETTLEMENT_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_INVENTORYTRANSACTIONSETTLEMENT",
            "target": "BA_INVENTORYTRANSACTION",
            "type": "FK_BA_INVENTORYTRANSACTIONSETTLEMENT_BA_INVENTORYTRANSACTION"
        },
        {
            "source": "BA_INVENTORYTRANSACTIONSETTLEMENT",
            "target": "BA_SALESORDER",
            "type": "FK_BA_INVENTORYTRANSACTIONSETTLEMENT_BA_SALESORDER"
        },
        {
            "source": "BA_INVENTORYTRANSACTIONSETTLEMENT",
            "target": "BV_COMPANY",
            "type": "FK_BA_INVENTORYTRANSACTIONSETTLEMENT_BV_COMPANY"
        },
        {
            "source": "BA_INVENTORYTRANSACTIONSETTLEMENT",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_INVENTORYTRANSACTIONSETTLEMENT_BV_CUSTOMER"
        },
        {
            "source": "BA_INVENTORYTRANSACTIONSETTLEMENT",
            "target": "BV_ITEM",
            "type": "FK_BA_INVENTORYTRANSACTIONSETTLEMENT_BV_ITEM"
        },
        {
            "source": "BA_ITEMORDERSETTING",
            "target": "BV_COMPANY",
            "type": "FK_BA_ITEMORDERSETTING_BV_COMPANY"
        },
        {
            "source": "BA_ITEMORDERSETTING",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_ITEMORDERSETTING_BV_EMPLOYEE"
        },
        {
            "source": "BA_ITEMORDERSETTING",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_ITEMORDERSETTING_BV_ITEM"
        },
        {
            "source": "BA_ITEMORDERSETTING",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_ITEMORDERSETTING_BV_SITE"
        },
        {
            "source": "BA_ITEMORDERSETTING",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_ITEMORDERSETTING_BV_WAREHOUSE"
        },
        {
            "source": "BA_LEAD",
            "target": "BV_CAMPAIGN",
            "type": "FK_BA_LEAD_BV_CAMPAIGN"
        },
        {
            "source": "BA_LEAD",
            "target": "BV_COMPANY",
            "type": "FK_BA_LEAD_BV_COMPANY"
        },
        {
            "source": "BA_LEAD",
            "target": "BV_CONTACTPERSON",
            "type": "FK_BA_LEAD_BV_CONTACTPERSON"
        },
        {
            "source": "BA_LEAD",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_LEAD_BV_CUSTOMER"
        },
        {
            "source": "BA_LEAD",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_LEAD_BV_EMPLOYEE_KEY_OWNER"
        },
        {
            "source": "BA_LEAD",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_LEAD_BV_SUPPLIER"
        },
        {
            "source": "BA_LEADPRODUCT",
            "target": "BA_LEAD",
            "type": "FK_BA_LEADPRODUCT_BA_LEAD"
        },
        {
            "source": "BA_LEADPRODUCT",
            "target": "BV_COMPANY",
            "type": "FK_BA_LEADPRODUCT_BV_COMPANY"
        },
        {
            "source": "BA_LEADPRODUCT",
            "target": "BV_MAINITEM",
            "type": "FK_BA_LEADPRODUCT_BV_EMPLOYEE_OWNER"
        },
        {
            "source": "BA_LEADPRODUCT",
            "target": "BV_MAINITEM",
            "type": "FK_BA_LEADPRODUCT_BV_ITEM"
        },
        {
            "source": "BA_LEADPRODUCT",
            "target": "BV_MAINITEM",
            "type": "FK_BA_LEADPRODUCT_BV_MAINITEM"
        },
        {
            "source": "BA_MAINTENANCEORDER",
            "target": "BV_COMPANY",
            "type": "FK_BA_MAINTENANCEORDER_BV_COMPANY"
        },
        {
            "source": "BA_MAINTENANCEORDER",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_MAINTENANCEORDER_BV_CUSTOMER"
        },
        {
            "source": "BA_MAINTENANCEORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_MAINTENANCEORDER_BV_ITEM"
        },
        {
            "source": "BA_MAINTENANCEORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_MAINTENANCEORDER_BV_SITE"
        },
        {
            "source": "BA_MAINTENANCEORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_MAINTENANCEORDER_BV_WAREHOUSE"
        },
        {
            "source": "BA_MARKETINTELLIGENCE",
            "target": "BA_ACTIVITY",
            "type": "FK_BA_MARKETINTELLIGENCE_BA_ACTIVITY"
        },
        {
            "source": "BA_MARKETINTELLIGENCE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_MARKETINTELLIGENCE_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_MARKETINTELLIGENCE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_MARKETINTELLIGENCE_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_MARKETINTELLIGENCE",
            "target": "BV_COMPANY",
            "type": "FK_BA_MARKETINTELLIGENCE_BV_COMPANY"
        },
        {
            "source": "BA_MARKETINTELLIGENCE",
            "target": "BV_COMPETITOR",
            "type": "FK_BA_MARKETINTELLIGENCE_BV_COMPETITOR"
        },
        {
            "source": "BA_MARKETINTELLIGENCE",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_MARKETINTELLIGENCE_BV_CUSTOMER"
        },
        {
            "source": "BA_MARKETINTELLIGENCE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_MARKETINTELLIGENCE_BV_EMPLOYEE_KEY_CREATED_BY"
        },
        {
            "source": "BA_MARKETINTELLIGENCE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_MARKETINTELLIGENCE_BV_EMPLOYEE_KEY_MODIFIED_BY"
        },
        {
            "source": "BA_MARKETINTELLIGENCE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_MARKETINTELLIGENCE_BV_EMPLOYEE_KEY_OWNED_BY"
        },
        {
            "source": "BA_MARKETINTELLIGENCE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_MARKETINTELLIGENCE_BV_ITEM"
        },
        {
            "source": "BA_MARKETINTELLIGENCE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_MARKETINTELLIGENCE_BV_MAINITEM"
        },
        {
            "source": "BA_MARKETINTELLIGENCE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_MARKETINTELLIGENCE_BV_PRODUCTGROUP"
        },
        {
            "source": "BA_MARKETINTELLIGENCE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_MARKETINTELLIGENCE_BV_UNITOFMEASURE_KEY_PACKAGING"
        },
        {
            "source": "BA_MEETINGREPORT",
            "target": "BA_ACTIVITY",
            "type": "FK_BA_MEETINGREPORT_BA_ACTIVITY"
        },
        {
            "source": "BA_MEETINGREPORT",
            "target": "BA_APPOINTMENT",
            "type": "FK_BA_MEETINGREPORT_BA_APPOINTMENT"
        },
        {
            "source": "BA_MEETINGREPORT",
            "target": "BA_CASE",
            "type": "FK_BA_MEETINGREPORT_BA_CASE"
        },
        {
            "source": "BA_MEETINGREPORT",
            "target": "BA_LEAD",
            "type": "FK_BA_MEETINGREPORT_BA_LEAD"
        },
        {
            "source": "BA_MEETINGREPORT",
            "target": "BA_OPPORTUNITY",
            "type": "FK_BA_MEETINGREPORT_BA_OPPORTUNITY"
        },
        {
            "source": "BA_MEETINGREPORT",
            "target": "BA_QUOTE",
            "type": "FK_BA_MEETINGREPORT_BA_QUOTE"
        },
        {
            "source": "BA_MEETINGREPORT",
            "target": "BV_COMPANY",
            "type": "FK_BA_MEETINGREPORT_BV_COMPANY_OWNER"
        },
        {
            "source": "BA_MEETINGREPORT",
            "target": "BV_CONTACTPERSON",
            "type": "FK_BA_MEETINGREPORT_BV_CONTACTPERSON_PRIMARY_C"
        },
        {
            "source": "BA_MEETINGREPORT",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_MEETINGREPORT_BV_CUSTOMER"
        },
        {
            "source": "BA_MEETINGREPORT",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_MEETINGREPORT_BV_EMPLOYEE_OWNER"
        },
        {
            "source": "BA_MEETINGREPORT",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_MEETINGREPORT_BV_ITEM"
        },
        {
            "source": "BA_MEETINGREPORT",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_MEETINGREPORT_BV_MAINITEM"
        },
        {
            "source": "BA_MEETINGREPORT",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_MEETINGREPORT_BV_SAMPLEREQUEST"
        },
        {
            "source": "BA_MEETINGREPORT",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_MEETINGREPORT_BV_SUPPLIER"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BA_CURRENCY",
            "type": "FK_BA_OPPORTUNITY_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BA_CURRENCY",
            "type": "FK_BA_OPPORTUNITY_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BA_LEAD",
            "type": "FK_BA_OPPORTUNITY_BA_LEAD"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BV_CAMPAIGN",
            "type": "FK_BA_OPPORTUNITY_BV_CAMPAIGN"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BV_COMPANY",
            "type": "FK_BA_OPPORTUNITY_BV_COMPANY_KEY_OWNER"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BV_COMPANY",
            "type": "FK_BA_OPPORTUNITY_BV_COMPANY_KEY_CDM"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_OPPORTUNITY_BV_CUSTOMER"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_OPPORTUNITY_BV_EMPLOYEE_KEY_CREATED_BY"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_OPPORTUNITY_BV_EMPLOYEE_KEY_MODIFIED_BY"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_OPPORTUNITY_BV_EMPLOYEE_KEY_OWNER"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_OPPORTUNITY_BV_EMPLOYEE_KEY_NPDLEADER"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_OPPORTUNITY_BV_EMPLOYEE_KEY_CDM"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_OPPORTUNITY_BV_ITEM"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_OPPORTUNITY_BV_MAINITEM"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_OPPORTUNITY_BV_PRODUCTGROUP"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_OPPORTUNITY_BV_SUPPLIER"
        },
        {
            "source": "BA_OPPORTUNITY",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_OPPORTUNITY_BV_UNITOFMEASURE"
        },
        {
            "source": "BA_PHONECALL",
            "target": "BA_ACTIVITY",
            "type": "FK_BA_PHONECALL_BA_ACTIVITY"
        },
        {
            "source": "BA_PHONECALL",
            "target": "BA_CASE",
            "type": "FK_BA_PHONECALL_BA_CASE"
        },
        {
            "source": "BA_PHONECALL",
            "target": "BA_LEAD",
            "type": "FK_BA_PHONECALL_BA_LEAD"
        },
        {
            "source": "BA_PHONECALL",
            "target": "BA_OPPORTUNITY",
            "type": "FK_BA_PHONECALL_BA_OPPORTUNITY"
        },
        {
            "source": "BA_PHONECALL",
            "target": "BA_QUOTE",
            "type": "FK_BA_PHONECALL_BA_QUOTE"
        },
        {
            "source": "BA_PHONECALL",
            "target": "BV_COMPANY",
            "type": "FK_BA_PHONECALL_BV_COMPANY"
        },
        {
            "source": "BA_PHONECALL",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_PHONECALL_BV_CUSTOMER"
        },
        {
            "source": "BA_PHONECALL",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PHONECALL_BV_EMPLOYEE_OWNER"
        },
        {
            "source": "BA_PHONECALL",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PHONECALL_BV_ITEM"
        },
        {
            "source": "BA_PHONECALL",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PHONECALL_BV_MAINITEM"
        },
        {
            "source": "BA_PHONECALL",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PHONECALL_BV_SAMPLEREQUEST"
        },
        {
            "source": "BA_PHONECALL",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PHONECALL_BV_SUPPLIER"
        },
        {
            "source": "BA_PRODUCTDEVELOPMENT",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PRODUCTDEVELOPMENT_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_PRODUCTDEVELOPMENT",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PRODUCTDEVELOPMENT_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_PRODUCTDEVELOPMENT",
            "target": "BV_BRANCH",
            "type": "FK_BA_PRODUCTDEVELOPMENT_BV_BRANCH"
        },
        {
            "source": "BA_PRODUCTDEVELOPMENT",
            "target": "BV_COMPANY",
            "type": "FK_BA_PRODUCTDEVELOPMENT_BV_COMPANY"
        },
        {
            "source": "BA_PRODUCTDEVELOPMENT",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_PRODUCTDEVELOPMENT_BV_CUSTOMER"
        },
        {
            "source": "BA_PRODUCTDEVELOPMENT",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PRODUCTDEVELOPMENT_BV_EMPLOYEE_KEY_CREATED_BY"
        },
        {
            "source": "BA_PRODUCTDEVELOPMENT",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PRODUCTDEVELOPMENT_BV_EMPLOYEE_KEY_MODIFIED_BY"
        },
        {
            "source": "BA_PRODUCTDEVELOPMENT",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PRODUCTDEVELOPMENT_BV_EMPLOYEE_KEY_OWNED_BY"
        },
        {
            "source": "BA_PRODUCTDEVELOPMENT",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PRODUCTDEVELOPMENT_BV_EMPLOYEE_KEY_NPD_LEADER"
        },
        {
            "source": "BA_PRODUCTDEVELOPMENT",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PRODUCTDEVELOPMENT_BV_EMPLOYEE_KEY_NPD_APPROVER"
        },
        {
            "source": "BA_PRODUCTDEVELOPMENT",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PRODUCTDEVELOPMENT_BV_EMPLOYEE_KEY_COMMERCIAL_APPROVER"
        },
        {
            "source": "BA_PRODUCTDEVELOPMENT",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PRODUCTDEVELOPMENT_BV_EMPLOYEE_KEY_APPLICANT"
        },
        {
            "source": "BA_PRODUCTDEVELOPMENT",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PRODUCTDEVELOPMENT_BV_SUPPLIER"
        },
        {
            "source": "BA_PRODUCTIONORDER",
            "target": "BV_BILLOFMATERIAL",
            "type": "FK_BA_PRODUCTIONORDER_BV_BILLOFMATERIAL"
        },
        {
            "source": "BA_PRODUCTIONORDER",
            "target": "BV_COMPANY",
            "type": "FK_BA_PRODUCTIONORDER_BV_COMPANY"
        },
        {
            "source": "BA_PRODUCTIONORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PRODUCTIONORDER_BV_ITEM"
        },
        {
            "source": "BA_PRODUCTIONORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PRODUCTIONORDER_BV_PRODUCTIONGROUP"
        },
        {
            "source": "BA_PRODUCTIONORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PRODUCTIONORDER_BV_PRODUCTIONPOOL"
        },
        {
            "source": "BA_PRODUCTIONORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PRODUCTIONORDER_BV_SITE"
        },
        {
            "source": "BA_PRODUCTIONORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PRODUCTIONORDER_BV_UNITOFMEASURE_KEY_INVENTORY"
        },
        {
            "source": "BA_PRODUCTIONORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PRODUCTIONORDER_BV_WAREHOUSE"
        },
        {
            "source": "BA_PRODUCTIONORDERBOM",
            "target": "BA_PRODUCTIONORDER",
            "type": "FK_BA_PRODUCTIONORDERBOM_BA_PRODUCTIONORDER"
        },
        {
            "source": "BA_PRODUCTIONORDERBOM",
            "target": "BV_COMPANY",
            "type": "FK_BA_PRODUCTIONORDERBOM_BV_COMPANY"
        },
        {
            "source": "BA_PRODUCTIONORDERBOM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PRODUCTIONORDERBOM_BV_ITEM"
        },
        {
            "source": "BA_PRODUCTIONORDERBOM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PRODUCTIONORDERBOM_BV_SITE"
        },
        {
            "source": "BA_PRODUCTIONORDERBOM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PRODUCTIONORDERBOM_BV_UNITOFMEASURE_KEY_INVENTORY"
        },
        {
            "source": "BA_PRODUCTIONORDERBOM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PRODUCTIONORDERBOM_BV_WAREHOUSE"
        },
        {
            "source": "BA_PRODUCTIONTRANSACTION_ACTUAL",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PRODUCTIONTRANSACTION_ACTUAL_BA_CURRENCY_TCY"
        },
        {
            "source": "BA_PRODUCTIONTRANSACTION_ACTUAL",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PRODUCTIONTRANSACTION_ACTUAL_BA_CURRENCY_LCY"
        },
        {
            "source": "BA_PRODUCTIONTRANSACTION_ACTUAL",
            "target": "BA_PRODUCTIONORDER",
            "type": "FK_BA_PRODUCTIONTRANSACTION_ACTUAL_BA_PRODUCTIONORDER"
        },
        {
            "source": "BA_PRODUCTIONTRANSACTION_ACTUAL",
            "target": "BV_COMPANY",
            "type": "FK_BA_PRODUCTIONTRANSACTION_ACTUAL_BV_COMPANY"
        },
        {
            "source": "BA_PRODUCTIONTRANSACTION_ACTUAL",
            "target": "BV_GL_ACCOUNT",
            "type": "FK_BA_PRODUCTIONTRANSACTION_ACTUAL_BV_GL_ACCOUNT"
        },
        {
            "source": "BA_PRODUCTIONTRANSACTION_ESTIMATE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PRODUCTIONTRANSACTION_ESTIMATE_BA_CURRENCY_TCY"
        },
        {
            "source": "BA_PRODUCTIONTRANSACTION_ESTIMATE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PRODUCTIONTRANSACTION_ESTIMATE_BA_CURRENCY_LCY"
        },
        {
            "source": "BA_PRODUCTIONTRANSACTION_ESTIMATE",
            "target": "BA_PRODUCTIONORDER",
            "type": "FK_BA_PRODUCTIONTRANSACTION_ESTIMATE_BA_PRODUCTIONORDER"
        },
        {
            "source": "BA_PRODUCTIONTRANSACTION_ESTIMATE",
            "target": "BV_COMPANY",
            "type": "FK_BA_PRODUCTIONTRANSACTION_ESTIMATE_BV_COMPANY"
        },
        {
            "source": "BA_PRODUCTIONTRANSACTION_ESTIMATE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_PRODUCTIONTRANSACTION_ESTIMATE_BV_GL_ACCOUNT"
        },
        {
            "source": "BA_PRODUCTIONTRANSACTION_ESTIMATE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_PRODUCTIONTRANSACTION_ESTIMATE_BV_ITEM_USED"
        },
        {
            "source": "BA_PRODUCTIONTRANSACTION_ESTIMATE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_PRODUCTIONTRANSACTION_ESTIMATE_BV_ITEM_PRODUCED"
        },
        {
            "source": "BA_PRODUCTIONTRANSACTION_ESTIMATE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_PRODUCTIONTRANSACTION_ESTIMATE_BV_UNITOFMEASURE"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PURCHASECONTRACT_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PURCHASECONTRACT_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BV_ADDRESS",
            "type": "FK_BA_PURCHASECONTRACT_BV_ADDRESS_KEY_PICKUP"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BV_CHAIN",
            "type": "FK_BA_PURCHASECONTRACT_BV_CHAIN"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BV_COMPANY",
            "type": "FK_BA_PURCHASECONTRACT_BV_COMPANY"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BV_CONTACTPERSON",
            "type": "FK_BA_PURCHASECONTRACT_BV_CONTACTPERSON"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BA_PURCHASECONTRACT_BV_DELIVERYTERM"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASECONTRACT_BV_EMPLOYEE_KEY_NOTIFICATION_USER"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASECONTRACT_BV_EMPLOYEE_KEY_HEADER_CREATED_BY"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASECONTRACT_BV_EMPLOYEE_KEY_LINE_CREATED_BY"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASECONTRACT_BV_EMPLOYEE_KEY_LINE_MODIFIED_BY"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASECONTRACT_BV_ITEM"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASECONTRACT_BV_PAYMENTTERM"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASECONTRACT_BV_SUPPLIER"
        },
        {
            "source": "BA_PURCHASECONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASECONTRACT_BV_WAREHOUSE"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BA_CURRENCY",
            "type": "FK_BA__PURCHASEORDER_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PURCHASEORDER_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BV_ADDRESS",
            "type": "FK_BA_PURCHASEORDER_BV_ADDRESS_KEY_DELIVERY"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BV_ADDRESS",
            "type": "FK_BA_PURCHASEORDER_BV_ADDRESS_KEY_PICKUP"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BV_COMPANY",
            "type": "FK_BA_PURCHASEORDER_BV_COMPANY"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BA_PURCHASEORDER_BV_DELIVERYTERM"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASEORDER_BV_EMPLOYEE_KEY_REPLENISHER"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASEORDER_BV_ITEM"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASEORDER_BV_PAYMENTTERM"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASEORDER_BV_PURCHASETRADEAGREEMENT"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASEORDER_BV_SITE"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASEORDER_BV_SUPPLIER"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASEORDER_BV_UNITOFMEASURE_KEY_PURCHASE"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASEORDER_BV_UNITOFMEASURE_KEY_INVENTORY"
        },
        {
            "source": "BA_PURCHASEORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_PURCHASEORDER_BV_WAREHOUSE"
        },
        {
            "source": "BA_PURCHASEORDERCONFIRMATION",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PURCHASEORDERCONFIRMATION_BA_CURRENCY"
        },
        {
            "source": "BA_PURCHASEORDERCONFIRMATION",
            "target": "BA_PURCHASEORDER",
            "type": "FK_BA_PURCHASEORDERCONFIRMATION_BA_PURCHASEORDER"
        },
        {
            "source": "BA_PURCHASEORDERCONFIRMATION",
            "target": "BV_COMPANY",
            "type": "FK_BA_PURCHASEORDERCONFIRMATION_BV_COMPANY"
        },
        {
            "source": "BA_PURCHASEORDERCONFIRMATION",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BA_PURCHASEORDERCONFIRMATION_BV_DELIVERYTERM"
        },
        {
            "source": "BA_PURCHASEORDERCONFIRMATION",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_PURCHASEORDERCONFIRMATION_BV_EMPLOYEE_KEY_ORDER_ENTERED_BY"
        },
        {
            "source": "BA_PURCHASEORDERCONFIRMATION",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_PURCHASEORDERCONFIRMATION_BV_EMPLOYEE_KEY_ORDER_CONFIRMATION_MODIFIED_BY"
        },
        {
            "source": "BA_PURCHASEORDERCONFIRMATION",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_PURCHASEORDERCONFIRMATION_BV_ITEM"
        },
        {
            "source": "BA_PURCHASEORDERCONFIRMATION",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_PURCHASEORDERCONFIRMATION_BV_SUPPLIER"
        },
        {
            "source": "BA_PURCHASEORDERCONFIRMATION",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_PURCHASEORDERCONFIRMATION_BV_UNITOFMEASURE"
        },
        {
            "source": "BA_PURCHASEORDERINVOICE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PURCHASEORDERINVOICE_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_PURCHASEORDERINVOICE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PURCHASEORDERINVOICE_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_PURCHASEORDERINVOICE",
            "target": "BA_PURCHASEORDER",
            "type": "FK_BA_PURCHASEORDERINVOICE_BA_PURCHASEORDER"
        },
        {
            "source": "BA_PURCHASEORDERINVOICE",
            "target": "BV_COMPANY",
            "type": "FK_BA_PURCHASEORDERINVOICE_BV_COMPANY"
        },
        {
            "source": "BA_PURCHASEORDERINVOICE",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PURCHASEORDERINVOICE_BV_ITEM"
        },
        {
            "source": "BA_PURCHASEORDERINVOICE",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_PURCHASEORDERINVOICE_BV_SUPPLIER"
        },
        {
            "source": "BA_PURCHASEORDERSETTLEMENT",
            "target": "BA_ACCOUNTSPAYABLE",
            "type": "FK_BA_PURCHASEORDERSETTLEMENT_BA_ACCOUNTSPAYABLE"
        },
        {
            "source": "BA_PURCHASEORDERSETTLEMENT",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PURCHASEORDERSETTLEMENT_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_PURCHASEORDERSETTLEMENT",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PURCHASEORDERSETTLEMENT_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_PURCHASEORDERSETTLEMENT",
            "target": "BV_COMPANY",
            "type": "FK_BA_PURCHASEORDERSETTLEMENT_BV_COMPANY"
        },
        {
            "source": "BA_PURCHASEPACKINGSLIP",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PURCHASEPACKINGSLIP_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_PURCHASEPACKINGSLIP",
            "target": "BA_CURRENCY",
            "type": "FK_BA_PURCHASEPACKINGSLIP_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_PURCHASEPACKINGSLIP",
            "target": "BA_PURCHASEORDER",
            "type": "FK_BA_PURCHASEPACKINGSLIP_BA_PURCHASEORDER"
        },
        {
            "source": "BA_PURCHASEPACKINGSLIP",
            "target": "BV_ADDRESS",
            "type": "FK_BA_PURCHASEPACKINGSLIP_BV_ADDRESS"
        },
        {
            "source": "BA_PURCHASEPACKINGSLIP",
            "target": "BV_COMPANY",
            "type": "FK_BA_PURCHASEPACKINGSLIP_BV_COMPANY"
        },
        {
            "source": "BA_PURCHASEPACKINGSLIP",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BA_PURCHASEPACKINGSLIP_BV_DELIVERYTERM"
        },
        {
            "source": "BA_PURCHASEPACKINGSLIP",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_PURCHASEPACKINGSLIP_BV_EMPLOYEE_KEY_PURCHASE_PLACER"
        },
        {
            "source": "BA_PURCHASEPACKINGSLIP",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_PURCHASEPACKINGSLIP_BV_ITEM"
        },
        {
            "source": "BA_PURCHASEPACKINGSLIP",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_PURCHASEPACKINGSLIP_BV_SUPPLIER"
        },
        {
            "source": "BA_PURCHASEPACKINGSLIP",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_PURCHASEPACKINGSLIP_BV_UNITOFMEASURE_KEY_PURCHASE"
        },
        {
            "source": "BA_PURCHASEPACKINGSLIP",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_PURCHASEPACKINGSLIP_BV_UNITOFMEASURE_KEY_INVENTORY"
        },
        {
            "source": "BA_QUALITYORDER",
            "target": "BA_PRODUCTIONORDER",
            "type": "FK_BA_QUALITYORDER_BA_PRODUCTIONORDER"
        },
        {
            "source": "BA_QUALITYORDER",
            "target": "BA_PURCHASEORDER",
            "type": "FK_BA_QUALITYORDER_BA_PURCHASEORDER"
        },
        {
            "source": "BA_QUALITYORDER",
            "target": "BA_SALESORDER",
            "type": "FK_BA_QUALITYORDER_BA_SALESORDER"
        },
        {
            "source": "BA_QUALITYORDER",
            "target": "BV_COMPANY",
            "type": "FK_BA_QUALITYORDER_BV_COMPANY"
        },
        {
            "source": "BA_QUALITYORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUALITYORDER_BV_EMPLOYEE_KEY_CREATED_BY"
        },
        {
            "source": "BA_QUALITYORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUALITYORDER_BV_EMPLOYEE_KEY_VALIDATED_BY"
        },
        {
            "source": "BA_QUALITYORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUALITYORDER_BV_ITEM"
        },
        {
            "source": "BA_QUALITYORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUALITYORDER_BV_SITE"
        },
        {
            "source": "BA_QUALITYORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUALITYORDER_BV_SUPPLIER"
        },
        {
            "source": "BA_QUALITYORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUALITYORDER_BV_WAREHOUSE"
        },
        {
            "source": "BA_QUALITYORDERRESULT",
            "target": "BA_QUALITYORDER",
            "type": "FK_BA_QUALITYORDERRESULT_BA_QUALITYORDER"
        },
        {
            "source": "BA_QUOTE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_QUOTE_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_QUOTE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_QUOTE_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_QUOTE",
            "target": "BA_OPPORTUNITY",
            "type": "FK_BA_QUOTE_BA_OPPORTUNITY"
        },
        {
            "source": "BA_QUOTE",
            "target": "BA_QUOTE",
            "type": "FK_BA_QUOTE_BA_QUOTE_KEY_HEADER"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_ADDRESS",
            "type": "FK_BA_QUOTE_BV_ADDRESS"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_COMPANY",
            "type": "FK_BA_QUOTE_BV_COMPANY_KEY_OWNER"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_COMPANY",
            "type": "FK_BA_QUOTE_BV_COMPANY_KEY_CDM"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_COMPETITOR",
            "type": "FK_BA_QUOTE_BV_COMPETITOR"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_QUOTE_BV_CUSTOMER"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BA_QUOTE_BV_DELIVERYTERM"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUOTE_BV_EMPLOYEE_KEY_ACCOUNTMANAGER"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUOTE_BV_EMPLOYEE_KEY_CREATED_BY"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUOTE_BV_EMPLOYEE_KEY_OWNER"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUOTE_BV_ITEM"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUOTE_BV_PAYMENTTERM"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUOTE_BV_SUPPLIER"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUOTE_BV_UNITOFMEASURE_KEY"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUOTE_BV_UNITOFMEASURE_KEY_SALES_UNIT_SOR"
        },
        {
            "source": "BA_QUOTE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_QUOTE_BV_WAREHOUSE"
        },
        {
            "source": "BA_RETURNABLEPACKAGING",
            "target": "BA_CURRENCY",
            "type": "FK_BA_RETURNABLEPACKAGING_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_RETURNABLEPACKAGING",
            "target": "BA_CURRENCY",
            "type": "FK_BA_RETURNABLEPACKAGING_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_RETURNABLEPACKAGING",
            "target": "BA_SALESORDER",
            "type": "FK_BA_RETURNABLEPACKAGING_BA_SALESORDER"
        },
        {
            "source": "BA_RETURNABLEPACKAGING",
            "target": "BV_ADDRESS",
            "type": "FK_BA_RETURNABLEPACKAGING_BV_ADDRESS_KEY_DELIVERY"
        },
        {
            "source": "BA_RETURNABLEPACKAGING",
            "target": "BV_COMPANY",
            "type": "FK_BA_RETURNABLEPACKAGING_BV_COMPANY"
        },
        {
            "source": "BA_RETURNABLEPACKAGING",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_RETURNABLEPACKAGING_BV_CUSTOMER"
        },
        {
            "source": "BA_RETURNABLEPACKAGING",
            "target": "BV_ITEM",
            "type": "FK_BA_RETURNABLEPACKAGING_BV_ITEM"
        },
        {
            "source": "BA_RETURNABLEPACKAGING",
            "target": "BV_ITEM",
            "type": "FK_BA_RETURNABLEPACKAGING_BV_ITEM_KEY_PARENT"
        },
        {
            "source": "BA_SALESCONTRACTLINEBREAKDOWN",
            "target": "BV_COMPANY",
            "type": "FK_BA_SALESCONTRACTLINEBREAKDOWN_BV_COMPANY"
        },
        {
            "source": "BA_SALESCONTRACTLINEBREAKDOWN",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_SALESCONTRACTLINEBREAKDOWN_BV_ITEM_INGREDIENT"
        },
        {
            "source": "BA_SALESCONTRACTLINEBREAKDOWN",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_SALESCONTRACTLINEBREAKDOWN_BV_ITEM_FINISHED_PRODUCT"
        },
        {
            "source": "BA_SALESCONTRACTLINEBREAKDOWN",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_SALESCONTRACTLINEBREAKDOWN_BV_SALESCONTRACT"
        },
        {
            "source": "BA_SALESCONTRACTLINEBREAKDOWN",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_SALESCONTRACTLINEBREAKDOWN_BV_UNITOFMEASURE_INGREDIENT"
        },
        {
            "source": "BA_SALESCOSTADJUSTMENT",
            "target": "BV_COMPANY",
            "type": "FK_BA_SALESCOSTADJUSTMENT_BV_COMPANY"
        },
        {
            "source": "BA_SALESCOSTADJUSTMENT",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_SALESCOSTADJUSTMENT_BV_UNITOFMEASURE_KEY_MARKUPWEIGHT"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BA_CURRENCY",
            "type": "FK_BA_SALESORDER_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BA_CURRENCY",
            "type": "FK_BA_SALESORDER_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BA_QUOTE",
            "type": "FK_BA_SALESORDER_BA_QUOTE_KEY_HEADER"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_ADDRESS",
            "type": "FK_BA_SALESORDER_BV_ADDRESS_KEY_DELIVERY_POSTAL_ADDRESS"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_COMPANY",
            "type": "FK_BA_SALESORDER_BV_COMPANY"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_SALESORDER_BV_CUSTOMER"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BA_SALESORDER_BV_DELIVERYTERM"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_DIVISION",
            "type": "FK_BA_SALESORDER_BV_DIVISION"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SALESORDER_BV_EMPLOYEE_KEY_CDM_PRIMARY"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SALESORDER_BV_EMPLOYEE_KEY_CDM"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SALESORDER_BV_EMPLOYEE_KEY_SALES_ORDER_TAKER"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SALESORDER_BV_ITEM"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SALESORDER_BV_PAYMENTTERM"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SALESORDER_BV_REPORTINGMODEL"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SALESORDER_BV_SITE"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SALESORDER_BV_UNITOFMEASURE_KEY_INVENTORY"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SALESORDER_BV_UNITOFMEASURE_KEY_SALES"
        },
        {
            "source": "BA_SALESORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SALESORDER_BV_WAREHOUSE"
        },
        {
            "source": "BA_SALESORDERCONFIRMATION",
            "target": "BA_SALESORDER",
            "type": "FK_BA_SALESORDERCONFIRMATION_BA_SALESORDER"
        },
        {
            "source": "BA_SALESORDERCONFIRMATION",
            "target": "BV_COMPANY",
            "type": "FK_BA_SALESORDERCONFIRMATION_BV_COMPANY"
        },
        {
            "source": "BA_SALESORDERCONFIRMATION",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BA_SALESORDERCONFIRMATION_BV_DELIVERYTERM"
        },
        {
            "source": "BA_SALESORDERCONFIRMATION",
            "target": "BV_EMPLOYEE",
            "type": "FK_BA_SALESORDERCONFIRMATION_BV_EMPLOYEE_KEY_ORDER_CONFIRMATION_MODIFIED_BY"
        },
        {
            "source": "BA_SALESORDERCONFIRMATION",
            "target": "BV_EMPLOYEE",
            "type": "FK_BA_SALESORDERCONFIRMATION_BV_EMPLOYEE_KEY_ORDER_ENTERED_BY"
        },
        {
            "source": "BA_SALESORDERINVOICE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_SALESORDERINVOICE_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_SALESORDERINVOICE",
            "target": "BA_CURRENCY",
            "type": "FK_BA_SALESORDERINVOICE_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_SALESORDERINVOICE",
            "target": "BA_SALESORDER",
            "type": "FK_BA_SALESORDERINVOICE_BA_SALESORDER"
        },
        {
            "source": "BA_SALESORDERINVOICE",
            "target": "BV_COMPANY",
            "type": "FK_BA_SALESORDERINVOICE_BV_COMPANY"
        },
        {
            "source": "BA_SALESORDERINVOICE",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_SALESORDERINVOICE_BV_CUSTOMER"
        },
        {
            "source": "BA_SALESORDERINVOICE",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_SALESORDERINVOICE_BV_CUSTOMER_KEY_ORDER"
        },
        {
            "source": "BA_SALESORDERINVOICE",
            "target": "BV_ITEM",
            "type": "FK_BA_SALESORDERINVOICE_BV_ITEM"
        },
        {
            "source": "BA_SALESORDERSETTLEMENT",
            "target": "BA_ACCOUNTSRECEIVABLE",
            "type": "FK_BA_SALESORDERSETTLEMENT_BA_ACCOUNTSRECEIVABLE"
        },
        {
            "source": "BA_SALESORDERSETTLEMENT",
            "target": "BA_CURRENCY",
            "type": "FK_BA_SALESORDERSETTLEMENT_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_SALESORDERSETTLEMENT",
            "target": "BA_CURRENCY",
            "type": "FK_BA_SALESORDERSETTLEMENT_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_SALESORDERSETTLEMENT",
            "target": "BV_COMPANY",
            "type": "FK_BA_SALESORDERSETTLEMENT_BV_COMPANY"
        },
        {
            "source": "BA_SALESPACKINGSLIP",
            "target": "BA_CURRENCY",
            "type": "FK_BA_SALESPACKINGSLIP_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BA_SALESPACKINGSLIP",
            "target": "BA_CURRENCY",
            "type": "FK_BA_SALESPACKINGSLIP_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BA_SALESPACKINGSLIP",
            "target": "BA_SALESORDER",
            "type": "FK_BA_SALESPACKINGSLIP_BA_SALESORDER"
        },
        {
            "source": "BA_SALESPACKINGSLIP",
            "target": "BV_ADDRESS",
            "type": "FK_BA_SALESPACKINGSLIP_BV_ADDRESS"
        },
        {
            "source": "BA_SALESPACKINGSLIP",
            "target": "BV_COMPANY",
            "type": "FK_BA_SALESPACKINGSLIP_BV_COMPANY"
        },
        {
            "source": "BA_SALESPACKINGSLIP",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_SALESPACKINGSLIP_BV_CUSTOMER"
        },
        {
            "source": "BA_SALESPACKINGSLIP",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BA_SALESPACKINGSLIP_BV_DELIVERYTERM"
        },
        {
            "source": "BA_SALESPACKINGSLIP",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_SALESPACKINGSLIP_BV_EMPLOYEE_KEY_SALES_TAKER"
        },
        {
            "source": "BA_SALESPACKINGSLIP",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_SALESPACKINGSLIP_BV_ITEM"
        },
        {
            "source": "BA_SALESPACKINGSLIP",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_SALESPACKINGSLIP_BV_UNITOFMEASURE"
        },
        {
            "source": "BA_SALESPACKINGSLIP",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BA_SALESPACKINGSLIP_BV_UNITOFMEASURE_KEY_INVENTORY"
        },
        {
            "source": "BA_SHIPMENT",
            "target": "BV_ADDRESS",
            "type": "FK_BA_SHIPMENT_BV_ADDRESS"
        },
        {
            "source": "BA_SHIPMENT",
            "target": "BV_COMPANY",
            "type": "FK_BA_SHIPMENT_BV_COMPANY"
        },
        {
            "source": "BA_SHIPMENT",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_SHIPMENT_BV_CUSTOMER"
        },
        {
            "source": "BA_SHIPMENT",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BA_SHIPMENT_BV_DELIVERYTERM"
        },
        {
            "source": "BA_SHIPMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SHIPMENT_BV_ITEM"
        },
        {
            "source": "BA_SHIPMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SHIPMENT_BV_SITE"
        },
        {
            "source": "BA_SHIPMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SHIPMENT_BV_SUPPLIER"
        },
        {
            "source": "BA_SHIPMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SHIPMENT_BV_UNITOFMEASURE_KEY_SALES"
        },
        {
            "source": "BA_SHIPMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SHIPMENT_BV_UNITOFMEASURE_KEY_PURCHASE"
        },
        {
            "source": "BA_SHIPMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SHIPMENT_BV_UNITOFMEASURE_KEY_INVENTORY"
        },
        {
            "source": "BA_SHIPMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_SHIPMENT_BV_WAREHOUSE"
        },
        {
            "source": "BA_SUPPLIERBATCHFACTOR",
            "target": "BA_SALESORDER",
            "type": "FK_BA_SUPPLIERBATCHFACTOR_BA_SALESORDER"
        },
        {
            "source": "BA_SUPPLIERBATCHFACTOR",
            "target": "BV_COMPANY",
            "type": "FK_BA_SUPPLIERBATCHFACTOR_BV_COMPANY"
        },
        {
            "source": "BA_SUPPLIERBATCHFACTOR",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_SUPPLIERBATCHFACTOR_BV_ITEM"
        },
        {
            "source": "BA_SUPPLIERBATCHFACTOR",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_SUPPLIERBATCHFACTOR_BV_ITEM_KEY_PRODUCED_LEVEL_1"
        },
        {
            "source": "BA_SUPPLIERBATCHFACTOR",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_SUPPLIERBATCHFACTOR_BV_ITEM_KEY_PRODUCED_LEVEL_2"
        },
        {
            "source": "BA_SUPPLIERBATCHFACTOR",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_SUPPLIERBATCHFACTOR_BV_ITEM_KEY_USED_LEVEL_3"
        },
        {
            "source": "BA_SUPPLIERBATCHFACTOR",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_SUPPLIERBATCHFACTOR_BV_ITEM_KEY_PRODUCED_LEVEL_3"
        },
        {
            "source": "BA_SUPPLIERBATCHFACTOR",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_SUPPLIERBATCHFACTOR_BV_ITEM_KEY_USED_LEVEL_1"
        },
        {
            "source": "BA_SUPPLIERBATCHFACTOR",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_SUPPLIERBATCHFACTOR_BV_ITEM_KEY_USED_LEVEL_2"
        },
        {
            "source": "BA_SUPPLIERBATCHFACTOR",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_SUPPLIERBATCHFACTOR_BV_SUPPLIER"
        },
        {
            "source": "BA_SUPPLIERBATCHFACTOR",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_SUPPLIERBATCHFACTOR_BV_SUPPLIER_KEY_LEVEL_3"
        },
        {
            "source": "BA_SUPPLIERBATCHFACTOR",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_SUPPLIERBATCHFACTOR_BV_SUPPLIER_KEY_LEVEL_2"
        },
        {
            "source": "BA_SUPPLIERBATCHFACTOR",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_SUPPLIERBATCHFACTOR_BV_SUPPLIER_KEY_LEVEL_1"
        },
        {
            "source": "BA_SUPPLIERBUSINESSTYPECONTACTRELATION",
            "target": "BV_BUSINESSTYPE",
            "type": "FK_BA_SUPPLIERBUSINESSTYPECONTACTRELATION_BV_BUSINESSTYPE"
        },
        {
            "source": "BA_SUPPLIERBUSINESSTYPECONTACTRELATION",
            "target": "BV_COMPANY",
            "type": "FK_BA_SUPPLIERBUSINESSTYPECONTACTRELATION_BV_COMPANY"
        },
        {
            "source": "BA_SUPPLIERBUSINESSTYPECONTACTRELATION",
            "target": "BV_CONTACTINFO",
            "type": "FK_BA_SUPPLIERBUSINESSTYPECONTACTRELATION_BV_CONTACTINFO"
        },
        {
            "source": "BA_SUPPLIERBUSINESSTYPECONTACTRELATION",
            "target": "BV_CONTACTPERSON",
            "type": "FK_BA_SUPPLIERBUSINESSTYPECONTACTRELATION_BV_CONTACTPERSON"
        },
        {
            "source": "BA_SUPPLIERBUSINESSTYPECONTACTRELATION",
            "target": "BV_CONTACTTYPE",
            "type": "FK_BA_SUPPLIERBUSINESSTYPECONTACTRELATION_BV_CONTACTTYPE"
        },
        {
            "source": "BA_SUPPLIERBUSINESSTYPECONTACTRELATION",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_SUPPLIERBUSINESSTYPECONTACTRELATION_BV_SUPPLIER"
        },
        {
            "source": "BA_TRANSFERORDER",
            "target": "BV_COMPANY",
            "type": "FK_BA_TRANSFERORDER_BV_COMPANY"
        },
        {
            "source": "BA_TRANSFERORDER",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BA_TRANSFERORDER_BV_DELIVERYTERM"
        },
        {
            "source": "BA_TRANSFERORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_TRANSFERORDER_BV_ITEM"
        },
        {
            "source": "BA_TRANSFERORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_TRANSFERORDER_BV_SITE_KEY_TO"
        },
        {
            "source": "BA_TRANSFERORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_TRANSFERORDER_BV_SITE_KEY_FROM"
        },
        {
            "source": "BA_TRANSFERORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_TRANSFERORDER_BV_UNITOFMEASURE_KEY_INVENTORY"
        },
        {
            "source": "BA_TRANSFERORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_TRANSFERORDER_BV_UNITOFMEASURE_KEY_SALES"
        },
        {
            "source": "BA_TRANSFERORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_TRANSFERORDER_BV_WAREHOUSE_KEY_TO"
        },
        {
            "source": "BA_TRANSFERORDER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_TRANSFERORDER_BV_WAREHOUSE_KEY_FROM"
        },
        {
            "source": "BA_TRANSPORTNOTE",
            "target": "BV_ADDRESS",
            "type": "FK_BA_TRANSPORTNOTE_BV_ADDRESS"
        },
        {
            "source": "BA_TRANSPORTNOTE",
            "target": "BV_COMPANY",
            "type": "FK_BA_TRANSPORTNOTE_BV_COMPANY"
        },
        {
            "source": "BA_TRANSPORTNOTE",
            "target": "BV_CUSTOMER",
            "type": "FK_BA_TRANSPORTNOTE_BV_CUSTOMER"
        },
        {
            "source": "BA_TRANSPORTNOTE",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_TRANSPORTNOTE_BV_EMPLOYEE_KEY_AUTHOR"
        },
        {
            "source": "BA_TRANSPORTNOTE",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_TRANSPORTNOTE_BV_EMPLOYEE_KEY_CREATEDBY"
        },
        {
            "source": "BA_TRANSPORTNOTE",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_TRANSPORTNOTE_BV_EMPLOYEE_KEY_MODIFIEDBY"
        },
        {
            "source": "BA_TRANSPORTNOTE",
            "target": "BV_SUPPLIER",
            "type": "FK_BA_TRANSPORTNOTE_BV_SUPPLIER"
        },
        {
            "source": "BA_WAREHOUSEACTIVITY",
            "target": "BA_INVENTORYTRANSACTION",
            "type": "FK_BA_WAREHOUSEACTIVITY_BA_INVENTORYTRANSACTION"
        },
        {
            "source": "BA_WAREHOUSEACTIVITY",
            "target": "BV_COMPANY",
            "type": "FK_BA_WAREHOUSEACTIVITY_BV_COMPANY"
        },
        {
            "source": "BA_WAREHOUSEACTIVITY",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_WAREHOUSEACTIVITY_BV_EMPLOYEE_KEY_WAREHOUSE"
        },
        {
            "source": "BA_WAREHOUSEACTIVITY",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_WAREHOUSEACTIVITY_BV_ITEM"
        },
        {
            "source": "BA_WAREHOUSEACTIVITY",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_WAREHOUSEACTIVITY_BV_SITE"
        },
        {
            "source": "BA_WAREHOUSEACTIVITY",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_WAREHOUSEACTIVITY_BV_UNITOFMEASURE"
        },
        {
            "source": "BA_WAREHOUSEACTIVITY",
            "target": "BV_WAREHOUSE",
            "type": "FK_BA_WAREHOUSEACTIVITY_BV_WAREHOUSE"
        },
        {
            "source": "BV_ACCOUNTMANAGERMATRIX",
            "target": "BV_COMPANY",
            "type": "FK_BV_ACCOUNTMANAGERMATRIX_BV_COMPANY"
        },
        {
            "source": "BV_ACCOUNTMANAGERMATRIX",
            "target": "BV_CUSTOMER",
            "type": "FK_BV_ACCOUNTMANAGERMATRIX_BV_CUSTOMER"
        },
        {
            "source": "BV_ACCOUNTMANAGERMATRIX",
            "target": "BV_ITEM",
            "type": "FK_BV_ACCOUNTMANAGERMATRIX_BV_EMPLOYEE_KEY_ACCOUNTMANAGER"
        },
        {
            "source": "BV_ACCOUNTMANAGERMATRIX",
            "target": "BV_ITEM",
            "type": "FK_BV_ACCOUNTMANAGERMATRIX_BV_ITEM"
        },
        {
            "source": "BV_ADDRESS",
            "target": "BV_ADDRESS",
            "type": "FK_BV_ADDRESS_BV_ADDRESS_KEY_SOR"
        },
        {
            "source": "BV_ADDRESS",
            "target": "BV_COUNTRY",
            "type": "FK_BV_ADDRESS_BV_COUNTRY"
        },
        {
            "source": "BV_ALLERGEN",
            "target": "BV_COMPANY",
            "type": "FK_BV_ALLERGEN_BV_COMPANY"
        },
        {
            "source": "BV_APPROVEDPRODUCER",
            "target": "BV_COMPANY",
            "type": "FK_BV_APPROVEDPRODUCER_BV_COMPANY"
        },
        {
            "source": "BV_APPROVEDPRODUCER",
            "target": "BV_SUPPLIER",
            "type": "FK_BV_APPROVEDPRODUCER_BV_MAINITEM"
        },
        {
            "source": "BV_APPROVEDPRODUCER",
            "target": "BV_SUPPLIER",
            "type": "FK_BV_APPROVEDPRODUCER_BV_SUPPLIER_KEY_APPROVED_PRODUCER"
        },
        {
            "source": "BV_APPROVEDSUPPLIER",
            "target": "BV_COMPANY",
            "type": "FK_BV_APPROVEDSUPPLIER_BV_COMPANY"
        },
        {
            "source": "BV_APPROVEDSUPPLIER",
            "target": "BV_SUPPLIER",
            "type": "FK_BV_APPROVEDSUPPLIER_BV_ITEM"
        },
        {
            "source": "BV_APPROVEDSUPPLIER",
            "target": "BV_SUPPLIER",
            "type": "FK_BV_APPROVEDSUPPLIER_BV_SUPPLIER"
        },
        {
            "source": "BV_BILLOFMATERIAL",
            "target": "BV_COMPANY",
            "type": "FK_BV_BILLOFMATERIAL_BV_COMPANY"
        },
        {
            "source": "BV_BILLOFMATERIAL",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_BILLOFMATERIAL_BV_EMPLOYEE_KEY_APPROVER"
        },
        {
            "source": "BV_BILLOFMATERIAL",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_BILLOFMATERIAL_BV_ITEM"
        },
        {
            "source": "BV_BILLOFMATERIAL",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_BILLOFMATERIAL_BV_ITEM_KEY_FORMULA"
        },
        {
            "source": "BV_BILLOFMATERIAL",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_BILLOFMATERIAL_BV_SITE"
        },
        {
            "source": "BV_BILLOFMATERIAL",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_BILLOFMATERIAL_BV_UNITOFMEASURE"
        },
        {
            "source": "BV_BILLOFMATERIAL",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_BILLOFMATERIAL_BV_WAREHOUSE"
        },
        {
            "source": "BV_BUSINESSTERM",
            "target": "BV_EMPLOYEE",
            "type": "FK_BV_BUSINESSTERM_BV_EMPLOYEE_KEY_DATA_OWNER"
        },
        {
            "source": "BV_BUSINESSTERM",
            "target": "BV_EMPLOYEE",
            "type": "FK_BV_BUSINESSTERM_BV_EMPLOYEE_KEY_DATA_STEWARD"
        },
        {
            "source": "BV_CASEASSOCIATION",
            "target": "BA_ACCOUNTSRECEIVABLE",
            "type": "FK_BV_CASEASSOCIATION_BA_ACCOUNTSRECEIVABLE"
        },
        {
            "source": "BV_CASEASSOCIATION",
            "target": "BA_CASE",
            "type": "FK_BV_CASEASSOCIATION_BA_CASE_KEY_REF"
        },
        {
            "source": "BV_CASEASSOCIATION",
            "target": "BA_CASE",
            "type": "FK_BV_CASEASSOCIATION_BA_CASE"
        },
        {
            "source": "BV_CASEASSOCIATION",
            "target": "BA_OPPORTUNITY",
            "type": "FK_BV_CASEASSOCIATION_BA_OPPORTUNITY"
        },
        {
            "source": "BV_CASEASSOCIATION",
            "target": "BA_SALESORDERINVOICE",
            "type": "FK_BV_CASEASSOCIATION_BA_SALESORDERINVOICE"
        },
        {
            "source": "BV_CASEASSOCIATION",
            "target": "BV_BILLOFMATERIAL",
            "type": "FK_BV_CASEASSOCIATION_BV_BILLOFMATERIAL"
        },
        {
            "source": "BV_CASEASSOCIATION",
            "target": "BV_CUSTOMER",
            "type": "FK_BV_CASEASSOCIATION_BV_CUSTOMER"
        },
        {
            "source": "BV_CASEASSOCIATION",
            "target": "BV_SUPPLIER",
            "type": "FK_BV_CASEASSOCIATION_BV_EMPLOYEE"
        },
        {
            "source": "BV_CASEASSOCIATION",
            "target": "BV_SUPPLIER",
            "type": "FK_BV_CASEASSOCIATION_BV_ITEM"
        },
        {
            "source": "BV_CASEASSOCIATION",
            "target": "BV_SUPPLIER",
            "type": "FK_BV_CASEASSOCIATION_BV_MAINITEM"
        },
        {
            "source": "BV_CASEASSOCIATION",
            "target": "BV_SUPPLIER",
            "type": "FK_BV_CASEASSOCIATION_BV_SUPPLIER"
        },
        {
            "source": "BV_CASHDISCOUNT",
            "target": "BV_COMPANY",
            "type": "FK_BV_CASHDISCOUNT_BV_COMPANY"
        },
        {
            "source": "BV_CHARGETYPE",
            "target": "BV_COMPANY",
            "type": "FK_BV_CHARGETYPE_BV_COMPANY"
        },
        {
            "source": "BV_COMPANY",
            "target": "BA_CURRENCY",
            "type": "FK_BV_COMPANY_BA_CURRENCY_KEY_COMPANY"
        },
        {
            "source": "BV_COMPANY",
            "target": "BV_COMPANY",
            "type": "FK_BV_COMPANY_BV_COMPANY_KEY_GROUPED_BY"
        },
        {
            "source": "BV_COMPANYCALENDAR",
            "target": "BV_COMPANY",
            "type": "FK_BV_COMPANYCALENDAR_BV_COMPANY"
        },
        {
            "source": "BV_COMPETITOR",
            "target": "BA_CURRENCY",
            "type": "FK_BV_COMPETITOR_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BV_CONTACTINFO",
            "target": "BV_CONTACTTYPE",
            "type": "FK_BV_CONTACTINFO_BV_CONTACTTYPE"
        },
        {
            "source": "BV_CONTACTPERSON",
            "target": "BV_COMPANY",
            "type": "FK_BV_CONTACTPERSON_BV_COMPANY"
        },
        {
            "source": "BV_CONTRACTRELATION",
            "target": "BA_PURCHASECONTRACT",
            "type": "FK_BV_CONTRACTRELATION_BA_PURCHASECONTRACT"
        },
        {
            "source": "BV_CONTRACTRELATION",
            "target": "BA_SALESCONTRACTLINEBREAKDOWN",
            "type": "FK_BV_CONTRACTRELATION_BA_SALESCONTRACTLINEBREAKDOWN"
        },
        {
            "source": "BV_CONTRACTRELATION",
            "target": "BV_COMPANY",
            "type": "FK_BV_CONTRACTRELATION_BV_COMPANY"
        },
        {
            "source": "BV_CONTRACTRELATION",
            "target": "BV_SALESCONTRACT",
            "type": "FK_BV_CONTRACTRELATION_BV_SALESCONTRACT"
        },
        {
            "source": "BV_COSTCENTER",
            "target": "BV_COMPANY",
            "type": "FK_BV_COSTCENTER_BV_COMPANY"
        },
        {
            "source": "BV_COSTCENTER",
            "target": "BV_COSTCENTER",
            "type": "FK_BV_COSTCENTER_BV_COSTCENTER_KEY_PARENT"
        },
        {
            "source": "BV_COSTCENTER",
            "target": "BV_EMPLOYEE",
            "type": "FK_BV_COSTCENTER_BV_EMPLOYEE_KEY_RESPONSIBLE"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BA_CURRENCY",
            "type": "FK_BV_CUSTOMER_BA_CURRENCY"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_ADDRESS",
            "type": "FK_BV_CUSTOMER_BV_ADDRESS"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_ADDRESS",
            "type": "FK_BV_CUSTOMER_BV_ADDRESS_KEY_VISIT"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_BRANCH",
            "type": "FK_BV_CUSTOMER_BV_BRANCH"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_CASHDISCOUNT",
            "type": "FK_BV_CUSTOMER_BV_CASHDISCOUNT"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_CHAIN",
            "type": "FK_BV_CUSTOMER_BV_CHAIN"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_COMPANY",
            "type": "FK_BV_CUSTOMER_BV_COMPANY"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_CONTACTPERSON",
            "type": "FK_BV_CUSTOMER_BV_CONTACTPERSON_KEY_DEFAULT"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_COSTCENTER",
            "type": "FK_BV_CUSTOMER_BV_COSTCENTER"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_COUNTRY",
            "type": "FK_BV_CUSTOMER_BV_COUNTRY"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_CUSTOMER",
            "type": "FK_BV_CUSTOMER_BV_CUSTOMER_KEY_SOR"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BV_CUSTOMER_BV_DELIVERYTERM"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_DIVISION",
            "type": "FK_BV_CUSTOMER_BV_DIVISION_KEY_DEFAULT"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_CUSTOMER_BV_EMPLOYEE_KEY_CUSTOMER_DEVELOPMENT_MANAGER"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_CUSTOMER_BV_EMPLOYEE_KEY_CUSTOMER_CARE_RESPONSIBLE"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_CUSTOMER_BV_KEYACCOUNT"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_CUSTOMER_BV_PAYMENTTERM"
        },
        {
            "source": "BV_CUSTOMER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_CUSTOMER_BV_WAREHOUSE_KEY_DEFAULT"
        },
        {
            "source": "BV_CUSTOMERBANKACCOUNT",
            "target": "BA_CURRENCY",
            "type": "FK_BV_CUSTOMERBANKACCOUNT_BA_CURRENCY"
        },
        {
            "source": "BV_CUSTOMERBANKACCOUNT",
            "target": "BV_COMPANY",
            "type": "FK_BV_CUSTOMERBANKACCOUNT_BV_COMPANY"
        },
        {
            "source": "BV_CUSTOMERBANKACCOUNT",
            "target": "BV_CUSTOMER",
            "type": "FK_BV_CUSTOMERBANKACCOUNT_BV_CUSTOMER"
        },
        {
            "source": "BV_DELIVERYTERM",
            "target": "BV_COMPANY",
            "type": "FK_BV_DELIVERYTERM_BV_COMPANY"
        },
        {
            "source": "BV_DIGITALASSET",
            "target": "BV_BRAND",
            "type": "FK_BV_DIGITALASSET_BV_BRAND"
        },
        {
            "source": "BV_DIGITALASSET",
            "target": "BV_DIGITALASSETTYPE",
            "type": "FK_BV_DIGITALASSET_BV_DIGITALASSETTYPE"
        },
        {
            "source": "BV_DIGITALASSET",
            "target": "BV_MAINITEM",
            "type": "FK_BV_DIGITALASSET_BV_MAINITEM"
        },
        {
            "source": "BV_DIGITALASSET",
            "target": "BV_MAINITEM",
            "type": "FK_BV_DIGITALASSET_BV_MAINITEM_PARENT"
        },
        {
            "source": "BV_DIVISION",
            "target": "BV_COMPANY",
            "type": "FK_BV_DIVISION_BV_COMPANY"
        },
        {
            "source": "BV_DIVISION",
            "target": "BV_DIVISION",
            "type": "FK_BV_DIVISION_BV_DIVISION_KEY_PARENT"
        },
        {
            "source": "BV_DIVISION",
            "target": "BV_EMPLOYEE",
            "type": "FK_BV_DIVISION_BV_EMPLOYEE_KEY_RESPONSIBLE"
        },
        {
            "source": "BV_DQ_RULE",
            "target": "BV_BUSINESSTERM",
            "type": "FK_BV_DQ_RULE_BV_BUSINESSTERM"
        },
        {
            "source": "BV_DQ_RULE",
            "target": "BV_DQ_DIMENSION",
            "type": "FK_BV_DQ_RULE_BV_DQ_DIMENSION"
        },
        {
            "source": "BV_EMPLOYEE",
            "target": "BV_COMPANY",
            "type": "FK_BV_EMPLOYEE_BV_COMPANY_KEY_HR"
        },
        {
            "source": "BV_EMPLOYEE",
            "target": "BV_EMPLOYEE",
            "type": "FK_BV_EMPLOYEE_BV_EMPLOYEE_KEY_MANAGER"
        },
        {
            "source": "BV_EMPLOYEE",
            "target": "BV_EMPLOYEE",
            "type": "FK_BV_EMPLOYEE_BV_EMPLOYEE_KEY_SOR"
        },
        {
            "source": "BV_EMPLOYMENT",
            "target": "BV_COMPANY",
            "type": "FK_BV_EMPLOYMENT_BV_COMPANY"
        },
        {
            "source": "BV_EMPLOYMENT",
            "target": "BV_DIVISION",
            "type": "FK_BV_EMPLOYMENT_BV_DIVISION_KEY_PARENT"
        },
        {
            "source": "BV_EMPLOYMENT",
            "target": "BV_EMPLOYEE",
            "type": "FK_BV_EMPLOYMENT_BV_EMPLOYEE"
        },
        {
            "source": "BV_EMPLOYMENT",
            "target": "BV_EMPLOYEE",
            "type": "FK_BV_EMPLOYMENT_BV_EMPLOYEE_KEY_COMPANY_HR_RESPONSIBLE"
        },
        {
            "source": "BV_EXCEPTIONMARGIN",
            "target": "BV_COMPANY",
            "type": "FK_BV_EXCEPTIONMARGIN_BV_COMPANY"
        },
        {
            "source": "BV_EXCEPTIONMARGIN",
            "target": "BV_ITEM",
            "type": "FK_BV_EXCEPTIONMARGIN_BV_ITEM"
        },
        {
            "source": "BV_EXTERNALITEMCUSTOMERSUPPLIER",
            "target": "BV_COMPANY",
            "type": "FK_BV_EXTERNALITEMCUSTOMERSUPPLIER_BV_COMPANY"
        },
        {
            "source": "BV_EXTERNALITEMCUSTOMERSUPPLIER",
            "target": "BV_CUSTOMER",
            "type": "FK_BV_EXTERNALITEMCUSTOMERSUPPLIER_BV_CUSTOMER"
        },
        {
            "source": "BV_EXTERNALITEMCUSTOMERSUPPLIER",
            "target": "BV_SUPPLIER",
            "type": "FK_BV_EXTERNALITEMCUSTOMERSUPPLIER_BV_ITEM"
        },
        {
            "source": "BV_EXTERNALITEMCUSTOMERSUPPLIER",
            "target": "BV_SUPPLIER",
            "type": "FK_BV_EXTERNALITEMCUSTOMERSUPPLIER_BV_SUPPLIER"
        },
        {
            "source": "BV_FINANCIALREPORTINGORGANISATION",
            "target": "BV_COMPANY",
            "type": "FK_BV_FINANCIALREPORTINGORGANISATION_BV_COMPANY"
        },
        {
            "source": "BV_FINANCIALREPORTINGORGANISATION",
            "target": "BV_COSTCENTER",
            "type": "FK_BV_FINANCIALREPORTINGORGANISATION_BV_COSTCENTER"
        },
        {
            "source": "BV_FINANCIALREPORTINGORGANISATION",
            "target": "BV_DIVISION",
            "type": "FK_BV_FINANCIALREPORTINGORGANISATION_BV_DIVISION"
        },
        {
            "source": "BV_FINANCIALREPORTINGORGANISATION",
            "target": "BV_FINANCIALREPORTINGORGANISATION",
            "type": "FK_BV_FINANCIALREPORTINGORGANISATION_BV_FINANCIALREPORTINGORGANISATION_KEY_PARENT"
        },
        {
            "source": "BV_GL_ACCOUNT",
            "target": "BV_GL_ACCOUNT",
            "type": "FK_BV_GL_ACCOUNT_BV_GL_ACCOUNT_KEY_PARENT"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_COMPANY",
            "type": "FK_BV_ITEM_BV_COMPANY"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_COSTCENTER",
            "type": "FK_BV_ITEM_BV_COSTCENTER"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_CUSTOMER",
            "type": "FK_BV_ITEM_BV_CUSTOMER_KEY_PRODUCT_OWNER"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_DIVISION",
            "type": "FK_BV_ITEM_BV_DIVISION"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_EMPLOYEE_KEY_PRODUCT_MANAGER"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_ITEM_KEY_SOR"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_MAINITEM"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_PRODUCTGROUP"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_PRODUCTIONGROUP"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_PRODUCTIONPOOL"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_SUPPLIER_KEY_PREFERRED_SUPPLIER"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_SUPPLIER_KEY_PRODUCER"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_UNITOFMEASURE_KEY_BOM"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_UNITOFMEASURE_KEY_INVENTORY"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_UNITOFMEASURE_KEY_PACKING"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_UNITOFMEASURE_KEY_PURCHASE"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_UNITOFMEASURE_KEY_SALES"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_WAREHOUSE_KEY_PURCHASE_DEFAULT"
        },
        {
            "source": "BV_ITEM",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_ITEM_BV_WAREHOUSE_KEY_SALES_DEFAULT"
        },
        {
            "source": "BV_ITEMALLERGENRELATION",
            "target": "BV_ALLERGEN",
            "type": "FK_BV_ITEMALLERGENRELATION_BV_ALLERGEN"
        },
        {
            "source": "BV_ITEMALLERGENRELATION",
            "target": "BV_MAINITEM",
            "type": "FK_BV_ITEMALLERGENRELATION_BV_MAINITEM"
        },
        {
            "source": "BV_ITEMPRECURSORRELATION",
            "target": "BV_PRECURSOR",
            "type": "FK_BV_ITEMPRECURSORRELATION_BV_MAINITEM"
        },
        {
            "source": "BV_ITEMPRECURSORRELATION",
            "target": "BV_PRECURSOR",
            "type": "FK_BV_ITEMPRECURSORRELATION_BV_PRECURSOR"
        },
        {
            "source": "BV_KEYACCOUNT",
            "target": "BV_EMPLOYEE",
            "type": "FK_BV_KEYACCOUNT_BV_EMPLOYEE_KEY_ACCOUNTMANAGER"
        },
        {
            "source": "BV_MAINITEM",
            "target": "BV_PRODUCTGROUP",
            "type": "FK_BV_MAINITEM_BV_MAINITEM_KEY_PARENT"
        },
        {
            "source": "BV_MAINITEM",
            "target": "BV_PRODUCTGROUP",
            "type": "FK_BV_MAINITEM_BV_MAINITEM_KEY_SOR"
        },
        {
            "source": "BV_MAINITEM",
            "target": "BV_PRODUCTGROUP",
            "type": "FK_BV_MAINITEM_BV_PRODUCTGROUP"
        },
        {
            "source": "BV_MAINITEMTRANSLATION",
            "target": "BV_MAINITEM",
            "type": "FK_BV_MAINITEMTRANSLATION_BV_MAINITEM"
        },
        {
            "source": "BV_PAYMENTTERM",
            "target": "BV_COMPANY",
            "type": "FK_BV_PAYMENTTERM_BV_COMPANY"
        },
        {
            "source": "BV_PAYMENTTERM",
            "target": "BV_PAYMENTTERM",
            "type": "FK_BV_PAYMENTTERM_BV_PAYMENTTERM_KEY_SOR"
        },
        {
            "source": "BV_PRODUCTIONGROUP",
            "target": "BV_COMPANY",
            "type": "FK_BV_PRODUCTIONGROUP_BV_COMPANY"
        },
        {
            "source": "BV_PRODUCTIONPOOL",
            "target": "BV_COMPANY",
            "type": "FK_BV_PRODUCTIONPOOL_BV_COMPANY"
        },
        {
            "source": "BV_PURCHASECONTRACTPURCHASEORDERRELATION",
            "target": "BA_PURCHASECONTRACT",
            "type": "FK_BV_PURCHASECONTRACTPURCHASEORDERRELATION_BA_PURCHASECONTRACT"
        },
        {
            "source": "BV_PURCHASECONTRACTPURCHASEORDERRELATION",
            "target": "BA_PURCHASEORDER",
            "type": "FK_BV_PURCHASECONTRACTPURCHASEORDERRELATION_BA_PURCHASEORDER"
        },
        {
            "source": "BV_PURCHASECONTRACTPURCHASEORDERRELATION",
            "target": "BV_COMPANY",
            "type": "FK_BV_PURCHASECONTRACTPURCHASEORDERRELATION_BV_COMPANY"
        },
        {
            "source": "BV_PURCHASETRADEAGREEMENT",
            "target": "BA_CURRENCY",
            "type": "FK_BV_PURCHASETRADEAGREEMENT_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BV_PURCHASETRADEAGREEMENT",
            "target": "BA_CURRENCY",
            "type": "FK_BV_PURCHASETRADEAGREEMENT_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BV_PURCHASETRADEAGREEMENT",
            "target": "BV_COMPANY",
            "type": "FK_BV_PURCHASETRADEAGREEMENT_BV_COMPANY"
        },
        {
            "source": "BV_PURCHASETRADEAGREEMENT",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BV_PURCHASETRADEAGREEMENT_BV_DELIVERYTERM"
        },
        {
            "source": "BV_PURCHASETRADEAGREEMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_PURCHASETRADEAGREEMENT_BV_ITEM"
        },
        {
            "source": "BV_PURCHASETRADEAGREEMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_PURCHASETRADEAGREEMENT_BV_SITE"
        },
        {
            "source": "BV_PURCHASETRADEAGREEMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_PURCHASETRADEAGREEMENT_BV_SUPPLIER"
        },
        {
            "source": "BV_PURCHASETRADEAGREEMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_PURCHASETRADEAGREEMENT_BV_UNITOFMEASURE"
        },
        {
            "source": "BV_PURCHASETRADEAGREEMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_PURCHASETRADEAGREEMENT_BV_WAREHOUSE"
        },
        {
            "source": "BV_REPORTINGMODEL",
            "target": "BV_COMPANY",
            "type": "FK_BV_REPORTINGMODEL_BV_COMPANY"
        },
        {
            "source": "BV_REPORTINGMODEL",
            "target": "BV_DIVISION",
            "type": "FK_BV_REPORTINGMODEL_BV_DIVISION_KEY_PARENT"
        },
        {
            "source": "BV_SALESBUDGET",
            "target": "BA_CURRENCY",
            "type": "FK_BV_SALESBUDGET_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BV_SALESBUDGET",
            "target": "BV_BRANCH",
            "type": "FK_BV_SALESBUDGET_BV_BRANCH"
        },
        {
            "source": "BV_SALESBUDGET",
            "target": "BV_COMPANY",
            "type": "FK_BV_SALESBUDGET_BV_COMPANY"
        },
        {
            "source": "BV_SALESBUDGET",
            "target": "BV_COUNTRY",
            "type": "FK_BV_SALESBUDGET_BV_COUNTRY"
        },
        {
            "source": "BV_SALESBUDGET",
            "target": "BV_CUSTOMER",
            "type": "FK_BV_SALESBUDGET_BV_CUSTOMER"
        },
        {
            "source": "BV_SALESBUDGET",
            "target": "BV_PRODUCTGROUP",
            "type": "FK_BV_SALESBUDGET_BV_EMPLOYEE_KEY_ACCOUNTMANAGER"
        },
        {
            "source": "BV_SALESBUDGET",
            "target": "BV_PRODUCTGROUP",
            "type": "FK_BV_SALESBUDGET_BV_EMPLOYEE_KEY_PRODUCTMANAGER"
        },
        {
            "source": "BV_SALESBUDGET",
            "target": "BV_PRODUCTGROUP",
            "type": "FK_BV_SALESBUDGET_BV_ITEM"
        },
        {
            "source": "BV_SALESBUDGET",
            "target": "BV_PRODUCTGROUP",
            "type": "FK_BV_SALESBUDGET_BV_PRODUCTGROUP"
        },
        {
            "source": "BV_SALESCONTRACT",
            "target": "BA_CURRENCY",
            "type": "FK_BV_SALESCONTRACT_BA_CURRENCY"
        },
        {
            "source": "BV_SALESCONTRACT",
            "target": "BV_CHAIN",
            "type": "FK_BV_SALESCONTRACT_BV_CHAIN"
        },
        {
            "source": "BV_SALESCONTRACT",
            "target": "BV_COMPANY",
            "type": "FK_BV_SALESCONTRACT_BV_COMPANY"
        },
        {
            "source": "BV_SALESCONTRACT",
            "target": "BV_CUSTOMER",
            "type": "FK_BV_SALESCONTRACT_BV_CUSTOMER"
        },
        {
            "source": "BV_SALESCONTRACT",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BV_SALESCONTRACT_BV_DELIVERYTERM"
        },
        {
            "source": "BV_SALESCONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SALESCONTRACT_BV_EMPLOYEE_KEY_NOTIFICATION_USER"
        },
        {
            "source": "BV_SALESCONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SALESCONTRACT_BV_EMPLOYEE_KEY_EXTERNAL_SALES_PERSON"
        },
        {
            "source": "BV_SALESCONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SALESCONTRACT_BV_EMPLOYEE_KEY_HEADER_CREATED_BY"
        },
        {
            "source": "BV_SALESCONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SALESCONTRACT_BV_EMPLOYEE_KEY_LINE_CREATED_BY"
        },
        {
            "source": "BV_SALESCONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SALESCONTRACT_BV_EMPLOYEE_KEY_LINE_MODIFIED_BY"
        },
        {
            "source": "BV_SALESCONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SALESCONTRACT_BV_ITEM"
        },
        {
            "source": "BV_SALESCONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SALESCONTRACT_BV_PAYMENTTERM"
        },
        {
            "source": "BV_SALESCONTRACT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SALESCONTRACT_BV_WAREHOUSE"
        },
        {
            "source": "BV_SALESCONTRACTSALESORDERRELATION",
            "target": "BA_SALESORDER",
            "type": "FK_BV_SALESCONTRACTSALESORDERRELATION_BA_SALESORDER"
        },
        {
            "source": "BV_SALESCONTRACTSALESORDERRELATION",
            "target": "BV_COMPANY",
            "type": "FK_BV_SALESCONTRACTSALESORDERRELATION_BV_COMPANY"
        },
        {
            "source": "BV_SALESCONTRACTSALESORDERRELATION",
            "target": "BV_SALESCONTRACT",
            "type": "FK_BV_SALESCONTRACTSALESORDERRELATION_BV_SALESCONTRACT"
        },
        {
            "source": "BV_SALESTRADEAGREEMENT",
            "target": "BA_CURRENCY",
            "type": "FK_BV_SALESTRADEAGREEMENT_BA_CURRENCY_KEY_LCY"
        },
        {
            "source": "BV_SALESTRADEAGREEMENT",
            "target": "BA_CURRENCY",
            "type": "FK_BV_SALESTRADEAGREEMENT_BA_CURRENCY_KEY_TCY"
        },
        {
            "source": "BV_SALESTRADEAGREEMENT",
            "target": "BV_COMPANY",
            "type": "FK_BV_SALESTRADEAGREEMENT_BV_COMPANY"
        },
        {
            "source": "BV_SALESTRADEAGREEMENT",
            "target": "BV_CUSTOMER",
            "type": "FK_BV_SALESTRADEAGREEMENT_BV_CUSTOMER"
        },
        {
            "source": "BV_SALESTRADEAGREEMENT",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BV_SALESTRADEAGREEMENT_BV_DELIVERYTERM"
        },
        {
            "source": "BV_SALESTRADEAGREEMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SALESTRADEAGREEMENT_BV_ITEM"
        },
        {
            "source": "BV_SALESTRADEAGREEMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SALESTRADEAGREEMENT_BV_SITE"
        },
        {
            "source": "BV_SALESTRADEAGREEMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SALESTRADEAGREEMENT_BV_UNITOFMEASURE"
        },
        {
            "source": "BV_SALESTRADEAGREEMENT",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SALESTRADEAGREEMENT_BV_WAREHOUSE"
        },
        {
            "source": "BV_SAMPLEREQUEST",
            "target": "BA_PRODUCTDEVELOPMENT",
            "type": "FK_BV_SAMPLEREQUEST_BA_PRODUCTDEVELOPMENT"
        },
        {
            "source": "BV_SAMPLEREQUEST",
            "target": "BV_ADDRESS",
            "type": "FK_BV_SAMPLEREQUEST_BV_ADDRESS_KEY_DELIVERY"
        },
        {
            "source": "BV_SAMPLEREQUEST",
            "target": "BV_COMPANY",
            "type": "FK_BV_SAMPLEREQUEST_BV_COMPANY"
        },
        {
            "source": "BV_SAMPLEREQUEST",
            "target": "BV_CUSTOMER",
            "type": "FK_BV_SAMPLEREQUEST_BV_CUSTOMER"
        },
        {
            "source": "BV_SAMPLEREQUEST",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_SAMPLEREQUEST_BV_EMPLOYEE_KEY_OWNER"
        },
        {
            "source": "BV_SAMPLEREQUEST",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_SAMPLEREQUEST_BV_EMPLOYEE_KEY_PRODUCT_CREATED_BY"
        },
        {
            "source": "BV_SAMPLEREQUEST",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_SAMPLEREQUEST_BV_EMPLOYEE_KEY_PRODUCT_MODIFIED_BY"
        },
        {
            "source": "BV_SAMPLEREQUEST",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_SAMPLEREQUEST_BV_EMPLOYEE_KEY_REQUEST_CREATED_BY"
        },
        {
            "source": "BV_SAMPLEREQUEST",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_SAMPLEREQUEST_BV_EMPLOYEE_KEY_REQUEST_MODIFIED_BY"
        },
        {
            "source": "BV_SAMPLEREQUEST",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_SAMPLEREQUEST_BV_ITEM"
        },
        {
            "source": "BV_SAMPLEREQUEST",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_SAMPLEREQUEST_BV_MAINITEM"
        },
        {
            "source": "BV_SAMPLEREQUEST",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_SAMPLEREQUEST_BV_PRODUCTGROUP"
        },
        {
            "source": "BV_SAMPLEREQUEST",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_SAMPLEREQUEST_BV_SUPPLIER"
        },
        {
            "source": "BV_SAMPLEREQUEST",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_SAMPLEREQUEST_BV_UNITOFMEASURE"
        },
        {
            "source": "BV_SITE",
            "target": "BV_COMPANY",
            "type": "FK_BV_SITE_BV_COMPANY"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BA_CURRENCY",
            "type": "FK_BV_SUPPLIER_BA_CURRENCY"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_ADDRESS",
            "type": "FK_BV_SUPPLIER_BV_ADDRESS"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_ADDRESS",
            "type": "FK_BV_SUPPLIER_BV_ADDRESS_KEY_VISIT"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_BRANCH",
            "type": "FK_BV_SUPPLIER_BV_BRANCH"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_CASHDISCOUNT",
            "type": "FK_BV_SUPPLIER_BV_CASHDISCOUNT"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_CHAIN",
            "type": "FK_BV_SUPPLIER_BV_CHAIN"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_COMPANY",
            "type": "FK_BV_SUPPLIER_BV_COMPANY"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_CONTACTPERSON",
            "type": "FK_BV_SUPPLIER_BV_CONTACTPERSON_KEY_DEFAULT"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_COSTCENTER",
            "type": "FK_BV_SUPPLIER_BV_COSTCENTER"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_COUNTRY",
            "type": "FK_BV_SUPPLIER_BV_COUNTRY"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_DELIVERYTERM",
            "type": "FK_BV_SUPPLIER_BV_DELIVERYTERM"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_DIVISION",
            "type": "FK_BV_SUPPLIER_BV_DIVISION_KEY_DEFAULT"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SUPPLIER_BV_KEYACCOUNT"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SUPPLIER_BV_PAYMENTTERM"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SUPPLIER_BV_SITE"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SUPPLIER_BV_SUPPLIER_KEY_SOR"
        },
        {
            "source": "BV_SUPPLIER",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_SUPPLIER_BV_WAREHOUSE_KEY_DEFAULT"
        },
        {
            "source": "BV_SUPPLIERBANKACCOUNT",
            "target": "BA_CURRENCY",
            "type": "FK_BV_SUPPLIERBANKACCOUNT_BA_CURRENCY"
        },
        {
            "source": "BV_SUPPLIERBANKACCOUNT",
            "target": "BV_COMPANY",
            "type": "FK_BV_SUPPLIERBANKACCOUNT_BV_COMPANY"
        },
        {
            "source": "BV_SUPPLIERBANKACCOUNT",
            "target": "BV_SUPPLIER",
            "type": "FK_BV_SUPPLIERBANKACCOUNT_BV_SUPPLIER"
        },
        {
            "source": "BV_TARGETPRICINGENGINE",
            "target": "BV_COMPANY",
            "type": "FK_BV_TARGETPRICINGENGINE_BV_COMPANY"
        },
        {
            "source": "BV_TARGETPRICINGENGINE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_TARGETPRICINGENGINE_BV_EMPLOYEE_KEY_RESPONSIBLE"
        },
        {
            "source": "BV_TARGETPRICINGENGINE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_TARGETPRICINGENGINE_BV_ITEM"
        },
        {
            "source": "BV_TARGETPRICINGENGINE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_TARGETPRICINGENGINE_BV_UNITOFMEASURE"
        },
        {
            "source": "BV_UNITOFMEASURE",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_UNITOFMEASURE_BV_UNITOFMEASURE_KEY_SOR"
        },
        {
            "source": "BV_UNITOFMEASURECONVERSION",
            "target": "BV_COMPANY",
            "type": "FK_BV_UNITOFMEASURECONVERSION_BV_COMPANY"
        },
        {
            "source": "BV_UNITOFMEASURECONVERSION",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_UNITOFMEASURECONVERSION_BV_ITEM"
        },
        {
            "source": "BV_UNITOFMEASURECONVERSION",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_UNITOFMEASURECONVERSION_BV_UNITOFMEASURE_KEY_FROM"
        },
        {
            "source": "BV_UNITOFMEASURECONVERSION",
            "target": "BV_UNITOFMEASURE",
            "type": "FK_BV_UNITOFMEASURECONVERSION_BV_UNITOFMEASURE_KEY_TO"
        },
        {
            "source": "BV_WAREHOUSE",
            "target": "BV_ADDRESS",
            "type": "FK_BV_WAREHOUSE_BV_ADDRESS"
        },
        {
            "source": "BV_WAREHOUSE",
            "target": "BV_COMPANY",
            "type": "FK_BV_WAREHOUSE_BV_COMPANY"
        },
        {
            "source": "BV_WAREHOUSE",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_WAREHOUSE_BV_WAREHOUSE_KEY_SOR"
        },
        {
            "source": "BV_WAREHOUSELOCATION",
            "target": "BV_COMPANY",
            "type": "FK_BV_WAREHOUSELOCATION_BV_COMPANY"
        },
        {
            "source": "BV_WAREHOUSELOCATION",
            "target": "BV_WAREHOUSE",
            "type": "FK_BV_WAREHOUSELOCATION_BV_WAREHOUSE"
        }
    ]
}



/*
  const dataset =  {
    nodes: [
          {id: 1, name: 'AGGR', label: 'Aggregation', group: 'Team C', runtime: 20},
          {id: 2, name: 'ASMT', label: 'Assessment Repository', group: 'Team A', runtime: 60},
          {id: 3, name: 'CALC', label: 'Final Calc', group: 'Team C', runtime: 30},
          {id: 4, name: 'DEMO', label: 'Demographic', group: 'Team B', runtime: 40},
          {id: 5, name: 'ELIG', label: 'Eligibility', group: 'Team B', runtime: 20},
          {id: 6, name: 'GOAL', label: 'Goal Setting', group: 'Team C', runtime: 60},
          {id: 7, name: 'GROW', label: 'Growth Model', group: 'Team C', runtime: 60},
          {id: 8, name: 'LINK', label: 'Linkage', group: 'Team A', runtime: 100},
          {id: 9, name: 'MOSL', label: 'MOSL', group: 'Team A', runtime: 80},
          {id: 10, name: 'MOTP', label: 'MOTP', group: 'Team A', runtime: 20},
          {id: 11, name: 'REPT', label: 'Reporting', group: 'Team E', runtime: 240},
          {id: 12, name: 'SEDD', label: 'State Data', group: 'Team A', runtime: 30},
          {id: 13, name: 'SNAP', label: 'Snapshot', group: 'Team A', runtime: 40}
      ], 
    links: [
      {source: 1, target: 3, type: 'Next -->>'},
      {source: 6, target: 1, type: 'Next -->>'},
      {source: 7, target: 1, type: 'Next -->>'},
      {source: 9, target: 1, type: 'Next -->>'},
      {source: 2, target: 4, type: 'Next -->>'},
      {source: 2, target: 6, type: 'Next -->>'},
      {source: 2, target: 7, type: 'Next -->>'},
      {source: 2, target: 8, type: 'Next -->>'},
      {source: 2, target: 9, type: 'Next -->>'},
      {source: 10, target: 3, type: 'Next -->>'},
      {source: 3, target: 11, type: 'Next -->>'},
      {source: 8, target: 5, type: 'Go to ->>'},
      {source: 8, target: 11, type: 'Go to ->>'},
      {source: 6, target: 9, type: 'Go to ->>'},
      {source: 7, target: 9, type: 'Go to ->>'},
      {source: 8, target: 9, type: 'Go to ->>'},
      {source: 9, target: 11, type: 'Go to ->>'},
      {source: 12, target: 9, type: 'Go to ->>'},
      {source: 13, target: 11, type: 'Go to ->>'},
      {source: 13, target: 2, type: 'Go to ->>'},
      {source: 13, target: 4, type: 'This way>>'},
      {source: 13, target: 5, type: 'This way>>'},
      {source: 13, target: 8, type: 'This way>>'},
      {source: 13, target: 9, type: 'This way>>'},
      {source: 13, target: 10, type: 'This way>>'},
      {source: 4, target: 7, type: 'Next -->>'},
      {source: 4, target: 2, type: 'Next -->>'}
    ]
  };
    */ 
    
  console.log("dataset is ...",dataset);
    
    // Initialize the links
  const link = svg.selectAll(".links")
            .data(dataset.links)
            .enter()
            .append("line")
            .attr("class", "links")
            .attr('marker-end','url(#arrowhead)') //The marker-end attribute defines the arrowhead or polymarker that will be drawn at the final vertex of the given shape.
    
    
    //The <title> element provides an accessible, short-text description of any SVG container element or graphics element.
    //Text in a <title> element is not rendered as part of the graphic, but browsers usually display it as a tooltip.
    link.append("title")
        .text(d => d.type);
    
  const edgepaths = svg.selectAll(".edgepath") //make path go along with the link provide position for link labels
            .data(dataset.links)
            .enter()
            .append('path')
            .attr('class', 'edgepath')
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0)
            .attr('id', function (d, i) {return 'edgepath' + i})
            .style("pointer-events", "none");
    
  const edgelabels = svg.selectAll(".edgelabel")
            .data(dataset.links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attr('class', 'edgelabel')
            .attr('id', function (d, i) {return 'edgelabel' + i})
            .attr('font-size', 8)
            .attr('fill', '#aaa');
    
    edgelabels.append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
        .attr('xlink:href', function (d, i) {return '#edgepath' + i})
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .attr("startOffset", "50%")
        .text("");
        // .text(d => d.type);
      
    // Initialize the nodes
  const node = svg.selectAll(".nodes")
        .data(dataset.nodes)
        .enter()
        .append("g")
        .attr("class", "nodes")
        .call(d3.drag() //sets the event listener for the specified typenames and returns the drag behavior.
            .on("start", dragstarted) //start - after a new pointer becomes active (on mousedown or touchstart).
            .on("drag", dragged)      //drag - after an active pointer moves (on mousemove or touchmove).
            //.on("end", dragended)     //end - after an active pointer becomes inactive (on mouseup, touchend or touchcancel).
        );
    
  node.append("circle")
        .attr("r", d=> 5)//+ d.runtime/20 )
        .style("stroke", "grey")
        .style("stroke-opacity",0.9)
        .style("stroke-width", 2)
        // .style("stroke-width", d => d.runtime/10)
        .style("fill", d => colorScale(d.group))
    
  node.append("title")
        .text(d => d.id + ": " + d.label + " - " + d.group +", runtime:"+ d.runtime+ "min");
    
  node.append("text")
        .attr("dy", 4)
        .attr("dx", 12)
        .attr("font-size", 10)
        .text(d => d.name);
    // node.append("text")
    //     .attr("dy",12)
    //     .attr("dx", -8)
    //     .text(d=> d.runtime);

    

  ////////////////////////////////////////////////////////////////
  // ZOOM
  function handleZoom(e) {
    d3.select('svg')
      .attr('transform', e.transform);
  }
  
  let zoom = d3.zoom()
    .on('zoom', handleZoom);
  
  d3.select('svg')
    .call(zoom);
  
  //Listen for tick events to render the nodes as they update in your Canvas or SVG.
  simulation
            .nodes(dataset.nodes)
            .on("tick", ticked);
    
  simulation.force("link")
            .links(dataset.links);
    
    
    // This function is run at each iteration of the force algorithm, updating the nodes position (the nodes data array is directly manipulated).
    function ticked() {
      link.attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
    
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    
      edgepaths.attr('d', d => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y);
    }
    
    //When the drag gesture starts, the targeted node is fixed to the pointer
    //The simulation is temporarily “heated” during interaction by setting the target alpha to a non-zero value.
    function dragstarted(e,d) {
          // if (e.active) 
          simulation.alphaTarget(0.3).restart();//sets the current target alpha to the specified number in the range [0,1].
          d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
          d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
    }
    
      //When the drag gesture starts, the targeted node is fixed to the pointer
      function dragged(e,d) {
        d.fx = e.x;
        d.fy = e.y;
      }
    
    //the targeted node is released when the gesture ends
    //   function dragended(d) {
    //     if (!d3.event.active) simulation.alphaTarget(0);
    //     d.fx = null;
    //     d.fy = null;
    
    //     console.log("dataset after dragged is ...",dataset);
    //   }
      
      //drawing the legend
      const legend_g = svg.selectAll(".legend")
      .data(colorScale.domain())
      .enter().append("g") 
      .attr("transform", (d, i) => `translate(${width-300 },${(i * 20) + 30})`); 
    
      legend_g.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", colorScale);
    
      legend_g.append("text")
        .attr("x", 10)
        .attr("y", 5)
        .text(d => d);
      
      //drawing the second legend
      const legend_g2 = svg.append("g") 
      //.attr("transform", (d, i) => `translate(${width},${i * 20})`); 
      .attr("transform", `translate(${width-300}, 150)`);
      
      legend_g2.append("circle")
        .attr("r", 5)
        .attr("cx", 0)
        .attr("cy", 0)
        .style("stroke", "grey")
        .style("stroke-opacity",0.3)
        .style("stroke-width", 15)
        .style("fill", "black")
      legend_g2.append("text")
         .attr("x",15)
         .attr("y",0)
         .text("long runtime");
      
        legend_g2.append("circle")
        .attr("r", 5)
        .attr("cx", 0)
        .attr("cy", 20)
        .style("stroke", "grey")
        .style("stroke-opacity",0.3)
        .style("stroke-width", 2)
        .style("fill", "black")
      legend_g2.append("text")
         .attr("x",15)
         .attr("y",20)
         .text("short runtime");
      
      