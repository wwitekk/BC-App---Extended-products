function ShortCatalogue(id, name, custom4, custom5, custom6){
	this.id = id;
	this.name = name;
	this.custom4 = custom4;
	this.custom5 = custom5;
	this.custom6 = custom6;
}

var getXMLProductsList = function(parentId){
	var siteId = 2211632,
		serviceUrl = 'https://ue-chris-extended-products-' +  siteId + '-apps.worldsecuresystems.com/catalystwebservice/catalystecommercewebservice.asmx',
		access_token = BCAPI.Helper.Site.getAccessToken(),
	 	soapQuery = '<?xml version="1.0" encoding="utf-8"?>'+
		'<soapenv:Envelope ' +
			'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
			'xmlns:cat="http://tempuri.org/CatalystDeveloperService/CatalystEcommerceWebservice">'+
		   '<soapenv:Header/>'+
		   '<soapenv:Body>'+
		      '<cat:Product_ListRetrieve>'+
		         '<cat:Username></cat:Username>'+
		         '<cat:Password>' + access_token + '</cat:Password>'+
		         '<cat:SiteId>' + siteId + '</cat:SiteId>'+
		         '<cat:CatalogueId>' +  parentId + '</cat:CatalogueId>'+
		      '</cat:Product_ListRetrieve>'+
		   '</soapenv:Body>'+
		'</soapenv:Envelope>';

	var request = new XMLHttpRequest();
	request.open("POST", serviceUrl, false);
	request.setRequestHeader('Content-Type','text/xml');
	request.setRequestHeader('SOAPAction','http://tempuri.org/CatalystDeveloperService/CatalystEcommerceWebservice/Product_ListRetrieve');
	request.send(soapQuery);
	
	var xmlDoc = request.responseXML;
	
	return xmlDoc;
};

var xmlProductToJson = function(XMLcatalogue){
	var id = XMLcatalogue.find('productId').text(),
		name = XMLcatalogue.find('productName').text();

	return new ShortCatalogue(id, name, '', '', '');
};

var getProductsList = function(parentId){
	var id = (parentId || -1), //-1 rootid
		xmlDoc = getXMLProductsList(id),
		$xml = $( xmlDoc ),
  		$products = $xml.find( "Products" ),
  		products = [];

	$products.each(function(){
		var $product = $(this);
		products.push(xmlProductToJson($product));
	});

	return products;
};

var getFileList = function(){
	var filename = '/products.json',
		products = [];
	$.ajaxSetup( { "async": false } );
	products = $.getJSON(filename);
	$.ajaxSetup( { "async": true } );
	var result = products.responseJSON.products;

	return result.length > 0 ? result : [];
};

var getFullBCList = function(){
	var products = getProductsList();	//initialize
	
	$.each(products, function(index, value){
		var children = getProductsList(value.id),
			parentPath = value.path,
			hasChildren = (children.length > 0);

		if(hasChildren){  
			for(var i = 0; i < children.length; ++i)
			{
				var child = children[i];
				child.path = parentPath + ' > ' + child.path; // create path
				products.splice(index + 1 + i, 0, child);		//this line is core for the function
			}
		}
	});
	return products;
};

var mergeArrays = function(BCitems, FileItems){
	var result = [];
	$.each(BCitems, function(i, item){
		var fileItem = $.grep(FileItems, function(fi){
				return fi.id == item.id;
		})[0];
		
		if(fileItem != null){
			item.custom4 = fileItem.custom4;
			item.custom5 = fileItem.custom5;
			item.custom6 = fileItem.custom6;
		}
		result.push(item);
	});
	return result;
};

var ProductsCtr = function($scope){
	var bcProducts = getProductsList(),
		fileProducts = getFileList(),
		result = mergeArrays(bcProducts, fileProducts);

	$scope.items = result;
	$scope.showTrigger = false;
	$scope.i = 0;

	$scope.filterFunction = function(element) {
	    return element.path.match(/^Ma/) ? true : false;
	};

	$scope.saveChanges = function(){
		var filename = 'products.json',
			f = new BCAPI.Models.FileSystem.File(filename);
			f.upload(JSON.stringify({products: $scope.items})).done(function(){
				console.log('Success!');
				$scope.showTrigger = true;
			}).error(function(){
				console.log("Request failed.");
			    console.log("Error code: " + jqXHR.status);
			    console.log("Error text: " + jqXHR.statusText);
			    console.log("Response text: " + jqXHR.responseText);
			});
	};
};