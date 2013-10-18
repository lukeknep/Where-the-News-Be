function makeBox(marker) {
    var thing = document.createElement("div");
    var box = document.getElementById("infobox-wrapper").appendChild(thing);
    box.setAttribute("id","infobox");
    box.innerHTML = marker.desc;
    var box = new InfoBox({
        content: box,
        disableAutoPan: false,
        maxWidth:200,
        pixelOffset: new google.maps.Size(-140,0),
        boxStyle: {
            background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
            opacity: 0.95,
            width: "280px"
        },
        closeBoxMargin: "12px 4px 1px 1px",
        closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
        infoBoxClearance: new google.maps.Size(1, 1)
    });
    return box;
}

function clearOverlays() {
    for(i in articles)
	articles[i].removeMarkerFromMap();
}

function showOverlays() {
    for(i in articles)
	if(articles[i].isFiltered() == false)
	    articles[i].addMarkerToMap();
}

function toggleHeatmap() {
    if(iw) {
	iw.hide();
	iw.close();
    }
    if (heatmap.getMap() != null) {
        heatmap.setMap(null);
        showOverlays();
    } else {
        clearOverlays();
        heatmap.setMap(map);
    }
}


function redraw() {
    console.log("Redrawing...");
    clearOverlays();

    //Redraw with or without heatmap
    heatmap.setData(getCurrentArticleLocationArray());
    if(heatmap.getMap() == null)
	showOverlays();
    else
        heatmap.setMap(map);
    
    populateList(getCurrentArticleArray())
}


function refresh() {
    console.log("Refresh Call");
    return redraw();
}

function populateList(arts) {
    //console.log('start pop');
    $('#articleList').empty();
    var html = "";
    $.each(arts, function() {
        html += "<li data-icon='false' data-inset='true' class='listItem'><a href='#'  onclick='highlightMarker("+this['id']+")'><span class='listTitle'>" + this['title']+ "</span><br/>"+this['summary']+"</a></li>";
    });
	$('#articleList').html(html).listview('refresh');      
}

function highlightMarker(id) {
    articles[id].bounceMarker();
    articles[id].marker.setOptions({zIndex:10});
    //$(oms).click(articles[id].marker);
    setTimeout("articles[" + id + "].unbounceMarker()", 2000);
}
