function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	var activities = getActivities(tweet_array);
	var most = getThreeMostEvents(activities);
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": graphArray(activities)
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
	  "encoding": {
		"y" : {"field": "activityType", "type": "nominal", "axis": {"labelAngle": 0}},
		"x" : {"field": "count", "type": "quantitative"}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	distanceVis = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": graphGroupedArray(tweet_array, most)
	  },
	  //TODO: Add mark and encoding
	  "mark": "point",
	  "encoding": {
		"x" : {"field": "day", "type": "ordinal", "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "axis": {"labelAngle": 0}},
		"y" : {"field": "distance", "type": "quantitative"},
		"color" : {"field" : "activityType", "type" : "nominal"}
	  }
	};

	distanceVisAggregated = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
		"values": graphGroupedArray(tweet_array, most)
	  },
	  //TODO: Add mark and encoding
	  "mark": "point",
	  "encoding": {
		"x" : {"field": "day", "type": "ordinal", "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "axis": {"labelAngle": 0}},
		"y" : {"field": "distance", "type": "quantitative", "aggregate": "mean"},
		"color" : {"field" : "activityType", "type" : "nominal"}
	  }
	};

	vegaEmbed('#distanceVis', distanceVis, {actions:false});

	document.getElementById('numberActivities').innerText = Object.keys(activities).length;
	document.getElementById('firstMost').innerText = most[0];
	document.getElementById('secondMost').innerText = most[1];
	document.getElementById('thirdMost').innerText = most[2];
	document.getElementById('longestActivityType').innerText = longestEvent(activities, most);
	document.getElementById('shortestActivityType').innerText = shortestEvent(activities, most);
	document.getElementById("aggregate").addEventListener('click', function() {
		if (this.textContent == "Show means") {
			vegaEmbed('#distanceVis', distanceVisAggregated, {actions:false});
			this.textContent = "Show all activities";
		}
		else {
			vegaEmbed('#distanceVis', distanceVis, {actions:false});
			this.textContent = "Show means";
		}
	});
	document.getElementById('weekdayOrWeekendLonger').innerText = "the weekend";
}

//creates a dictionary and fills it with activities, keeps a count and average distance
function getActivities(tweet_array) {
	var activities = {};
	for (var i = 0; i < tweet_array.length; i++) {
		if (activities[tweet_array[i].activityType] != undefined) {
			activities[tweet_array[i].activityType].count = activities[tweet_array[i].activityType].count + 1;
			activities[tweet_array[i].activityType].distance += tweet_array[i].distance;
		}
		else {
			activities[tweet_array[i].activityType] = {
				count: 1,
				distance: tweet_array[i].distance
			};
		}
	}
	return activities;
}

//returns an array of keys in order from the most counted event to the least
function getThreeMostEvents(activites) {
	var most = ['', '', '']
	var max = 0;
	var copy = {...activites}
	for (var i = 0; i < 3; i++) {
		for(activity in copy) {
			if (copy[activity].count > max){
				max = copy[activity].count;
				most[i] = activity;
			}
		}
		delete copy[most[i]];
		max = 0;
	}
	return most;
}

//finds longest average distance between three most popular activities
function longestEvent(activities, most){
	var max = 0;
	var longest = '';
	for (var i = 0; i < most.length; i++) {
		if (max < activities[most[i]].distance/activities[most[i]].count) {
			longest = most[i];
			max = activities[most[i]].distance/activities[most[i]].count;
		}
	}
	return longest;
}

//finds shortest average distance between three most popular activities
function shortestEvent(activities, most){
	var min = Infinity;
	var shortest = '';
	for (var i = 0; i < most.length; i++) {
		if (min > activities[most[i]].distance/activities[most[i]].count) {
			shortest = most[i];
			min = activities[most[i]].distance/activities[most[i]].count;
		}
	}
	return shortest;
}

//returns array with data for graph, activityType and count
function graphArray(activities) {
	var data = [];
	for (activity in activities) {
		if (activity != '' && activity != 'unknown')
			data.push({
				activityType: activity,
				count: activities[activity].count
		});
	}
	return data;
}

//returns array with data for graph with days, uses date, distance, and activityType
function graphGroupedArray(tweet_array, most) {
	var data = []
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].activityType == most[0] || tweet_array[i].activityType == most[1] || tweet_array[i].activityType == most[2]) {
			data.push({
				activityType: tweet_array[i].activityType,
				distance: tweet_array[i].distance,
				day: tweet_array[i].time.toLocaleDateString("en-US", {weekday: "short"})
			})
		}
	}
	return data;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});