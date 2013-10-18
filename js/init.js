var map, heatmap, mapOptions, currentWindow, oms, iw;
var articles = [];

function initialize() {

	var gm = google.maps;

    //Initial Map Setup
    mapOptions = {
        center: new google.maps.LatLng(11.50, 23.35),
        zoom: 2,
        minZoom: 2,
        mapTypeControl: false, 
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl:false,
        styles:stylesArray,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.DEFAULT
        }
    };
    currentWindow = null;
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);


    //Close Open Info Boxes
    google.maps.event.addListener(map, 'click', function() {
	if (currentWindow != null) {
            currentWindow.close();
	}
    });

    //Spiderfier
    oms = new OverlappingMarkerSpiderfier(map, {
        keepSpiderfied:true,
        legWeight: 2
    });
    oms.addListener('click', function(marker) {
        if (currentWindow != null) currentWindow.close();
        iw = makeBox(marker);
        iw.open(map, marker);
        currentWindow = iw;
    });
	
	/*  //If tryna do bigger shadows, this code is a good start.
	var shadow = new gm.MarkerImage(
        "images/markers/shadow.png"
    );
	oms.addListener('spiderfy', function(markers) {
        for(var i = 0; i < markers.length; i ++) {
 //         markers[i].setIcon("images/markers/" + articles[i].category.toLowerCase() + ".png");
          markers[i].setShadow(null);
        } 
//        iw.close();
    });
    oms.addListener('unspiderfy', function(markers) {
        for(var i = 0; i < markers.length; i ++) {
//          markers[i].setIcon("images/markers/many.png");
          markers[i].setShadow(shadow);
        }
    });
	*/

    //Initialize Heatmap
    heatmap = new google.maps.visualization.HeatmapLayer({
	radius: 20
    });

    //Load Data
    $.getJSON("test_feed.html", function(data) {
	for(var i = 0; i < data.length; i++) {
	    var article = data[i];
	    var item = new Item(article.title, article.summary, article.source, article.category,
				article.link, parseFloat(article.latitude), parseFloat(article.longitude),
				article.region, article.country, article.time, i);
	    
	    //Make sure item is valid
	    if(item.latitude && item.longitude) {
		articles.push(item);
		oms.addMarker(item.marker);
	    }
	}
	heatmap.setData(getCurrentArticleLocationArray());
	
	//Populate Story List
	populateList(getCurrentArticleArray())
    });

	$("#categories span.ui-btn-inner").css("padding", "3px");
	$("#categories span.ui-btn-text").css("position", "relative").css("top","-7px").css("font-size", "12px");

    //Add id, but what does it actually get used for?
    $(function() {
		$(".ui-listview-filter").attr("id","filt");
		$(".ui-collapsible-content").css("height", ($(window).height() - 100) + "px");
    });

    //First draw of content
    redraw();
}
