//Item declaration
function Item(title, summary, source, category, link, lat, lng, region, country, time, id) {
    this.title = title;
    this.summary = summary;
    this.source = source;
    this.category = category;
    this.link = link;
    this.latitude = lat;
    this.longitude = lng;
    this.googlePos = new google.maps.LatLng(lat, lng);
    this.region = region;
    this.country = country;
    this.time = new Date(time);
    this.id = id;

    //Create Marker
    this.marker = new google.maps.Marker({
        position: this.googlePos,
        map: map,
        title: this.title,
        icon: "images/markers/" + this.category.toLowerCase() + ".png",
    });
    this.marker.id = this.id;
    this.marker.desc = this.summary + '<a href="' + this.link + '"><br />Read Full Article</a>';
}

Item.prototype.addMarkerToMap = function() {
    this.marker.setMap(map);
}

Item.prototype.removeMarkerFromMap = function() {
    this.marker.setMap(null);
}

Item.prototype.hasLocation = function() {
    return this.latitude && this.longitude;
}

Item.prototype.bounceMarker = function() {
    this.marker.setAnimation(google.maps.Animation.BOUNCE);
}

Item.prototype.unbounceMarker = function() {
    this.marker.setAnimation(null);
}

Item.prototype.isFiltered = function() {
    if(filter.sources.indexOf(this.source) != -1)
	return true;

    if(filter.categories.indexOf(this.category) != -1)
	return true;

    return false;
}

//Returns all article locations that are not being filtered
function getCurrentArticleLocationArray() {
    var result = [];
    for(var i = 0; i < articles.length; i++)
	if(articles[i].isFiltered() == false)
	    result.push(articles[i].googlePos);
    return result;
}

//Returns all articles that are not being filtered
function getCurrentArticleArray() {
    var result = [];
    for(var i = 0; i < articles.length; i++)
	if(articles[i].isFiltered() == false)
	    result.push(articles[i]);
    return result;
}

var filter = {};
filter.sources = [];
filter.categories = [];

filter.addSource = function(source) {
    this.sources.push(source);
}

filter.removeSource = function(source) {
    this.sources.splice(this.sources.indexOf(source), 1);
}

filter.toggleSource = function(source) {
    if(this.sources.indexOf(source) != -1)
	this.removeSource(source);
    else
	this.addSource(source);
    redraw();
}

filter.addCategory = function(category) {
    this.categories.push(category);
}

filter.removeCategory = function(category) {
    this.categories.splice(this.categories.indexOf(category), 1);
}

filter.toggleCategory = function(category) {
    if(this.categories.indexOf(category) != -1)
	this.removeCategory(category);
    else
	this.addCategory(category);
    redraw();
}

filter.clear = function() {
    this.sources = [];
    this.categories = [];
}


function generateTestData(arr, n) {
    
    for(var i = 0; i < n; i++) {
	var obj = {};
	obj.title = "Test " + i;
	obj.summary = "Summary " + i;
	obj.source = "Source " + i % 5; //Gives us 5 sources initially
	obj.category = "Category " + i % 10; //Gives us 10 categories initially
	obj.link = "Link " + i;
	obj.lat = 37.424 + (Math.random() / 10);
	obj.lng = -122.165 + (Math.random() / 10);
	obj.time = new Date();
	obj.time.setTime(obj.time.getTime() - Math.random() * 86400000); //Range of 1 day in the past
	arr.push(obj);
    }
}


//var articles = [];
//generateTestData(articles, 10);

/*$.getJSON("test_feed.html", function(data) {
    for(var i = 0; i < data.length; i++) {
	var article = data[i];
	var item = new Item(article.title, article.summary, article.source, article.category,
			    article.link, parseFloat(article.latitude), parseFloat(article.longitude),
			    article.region, article.country, article.time, i);

	//Make sure item is valid
	if(item.latitude && item.longitude) {
	    articles.push(item);
	}
    }
    //return initialize();
});*/
