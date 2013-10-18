console.log("data.js loaded...");

//Item declaration - not necesasry but could be useful?
function Item(title, summary, source, category, link, lat, lng, region, country, time) {
    this.title = title;
    this.summary = summary;
    this.source = source;
    this.category = category;
    this.link = link;
    this.latitude = lat;
    this.longitude = lng;
    this.region = region;
    this.country = country;
    this.time = new Date(time);
}

Item.prototype.placeOnMap = function() {
    console.log("Placing Item On Map at ", this.lat, this.lng);
    //Implement me if you guys everwant to use this!
}

Item.prototype.isFiltered = function() {
    if(filter.sources.indexOf(this.source) != -1)
	return true;

    if(filter.categories.indexOf(this.category) != -1)
	return true;

    return false;
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

filter.addCategory = function(category) {
    this.categories.push(category);
}

filter.removeCategory = function(category) {
    this.categories.splice(this.categories.indexOf(category), 1);
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


var articles = [];
//generateTestData(articles, 10);

$.getJSON("test_feed.html", function(data) {
    for(var i = 0; i < data.length; i++) {
	var article = data[i];
	articles.push(new Item(article.title, article.summary, article.source, article.category,
			       article.link, parseFloat(article.latitude), parseFloat(article.longitude),
			       article.region, article.country, article.time));
    }
    return initialize();
});
