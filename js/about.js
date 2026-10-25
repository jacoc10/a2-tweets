function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!

	var events = getNumOfTypeEvents(tweet_array);

	document.getElementById('numberTweets').innerText = tweet_array.length;	
	document.getElementById('firstDate').innerText = findEarliestTweet(tweet_array).time.toLocaleDateString("en-US", options);
	document.getElementById('lastDate').innerText = findLastestTweet(tweet_array).time.toLocaleDateString("en-US", options);
	document.getElementsByClassName('liveEvents')[0].innerText = events[0];
	document.getElementsByClassName('achievements')[0].innerText = events[1];
	document.getElementsByClassName('completedEvents')[0].innerText = events[2];
	document.getElementsByClassName('completedEvents')[1].innerText = events[2];
	document.getElementsByClassName('miscellaneous')[0].innerText = events[3];
	document.getElementsByClassName('liveEventsPct')[0].innerText = math.format((events[0]/tweet_array.length)*100, {notation: 'fixed', precision: 2}) + '%';
	document.getElementsByClassName('achievementsPct')[0].innerText = math.format((events[1]/tweet_array.length)*100, {notation: 'fixed', precision: 2}) + '%';
	document.getElementsByClassName('completedEventsPct')[0].innerText = math.format((events[2]/tweet_array.length)*100, {notation: 'fixed', precision: 2}) + '%';
	document.getElementsByClassName('miscellaneousPct')[0].innerText = math.format((events[3]/tweet_array.length)*100, {notation: 'fixed', precision: 2}) + '%';
	document.getElementsByClassName('written')[0].innerText = getNumberOfUserWritten(tweet_array);
	document.getElementsByClassName('writtenPct')[0].innerText = math.format(((getNumberOfUserWritten(tweet_array))/events[2])*100, {notation: 'fixed', precision: 2}) + '%';
}

//function loops through tweet_array and takes the earliest tweet
function findEarliestTweet(tweet_array) {
	if(tweet_array.length == 0)
		return null;
	else
		var earliestTweet = tweet_array[0];
		for(var i = 0; i < tweet_array.length-1; i++) 
			if (earliestTweet.time > tweet_array[i+1].time) {earliestTweet = tweet_array[i+1];}
		return earliestTweet;
	}

//function loops through tweet_array and takes the latest tweet
function findLastestTweet(tweet_array) {
	if(tweet_array.length == 0)
		return null;
	else
		var latestTweet = tweet_array[0];
		for(var i = 0; i < tweet_array.length-1; i++) 
			if (latestTweet.time < tweet_array[i+1].time) {latestTweet = tweet_array[i+1];}
		return latestTweet;
	}

//function loops through and returns an array of the number of events sorted in live_event', 'achievement', 'completed_event', or 'miscellaneous'
function getNumOfTypeEvents(tweet_array) {
	var events = [0,0,0,0];
	for(var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source == 'live_event')
			events[0] +=1;
		else if (tweet_array[i].source == 'achievement')
			events[1] +=1;
		else if (tweet_array[i].source == 'completed_event')
			events[2] +=1;
		else if (tweet_array[i].source == 'miscellaneous')
			events[3] +=1;
	}
	return events;
}

function getNumberOfUserWritten(tweet_array) {
	var events = 0;
	for(var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source == 'completed_event' && tweet_array[i].written)
			events +=1;
	}
	return events;
}

//converts numerical date into month(string) day(int), year(int)
const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});