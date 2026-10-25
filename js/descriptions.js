function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	tweet_array = tweet_array.filter(function(tweet) {return tweet.written});
	//starts at 0 and no input text ''
	document.getElementById("searchCount").innerText = 0;
	document.getElementById("searchText").innerText = '';
}

//adds event listener for input, resets the table before filtering using inputted text. adds all the accumalted rows at the end for performance improvement.
function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	document.getElementById('textFilter').addEventListener('input', function() {
		filtered_array = tweet_array.filter(function(tweet) {return tweet.text.search(document.getElementById('textFilter').value) >= 0 && tweet.text.search(document.getElementById('textFilter').value) != '';});
		document.getElementById('tweetTable').innerHTML = '';
		document.getElementById('searchCount').innerText = filtered_array.length;
		document.getElementById('searchText').innerText = document.getElementById('textFilter').value;
		var rows = '';
		for (var i = 0; i < filtered_array.length; i++) 
			rows += filtered_array[i].getHTMLTableRow(i + 1);
		document.getElementById('tweetTable').innerHTML = rows;
	})
}



//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});