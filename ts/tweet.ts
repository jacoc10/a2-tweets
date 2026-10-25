class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.startsWith('Just'))
            return 'completed_event';
        else if (this.text.startsWith('Achieved'))
            return 'achievement';
        else if (this.text.startsWith('Watch'))
            return 'live_event';
        else
            return 'miscellaneous'
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.text.includes('Check it out!'))
            return false;
        else if (this.text.includes('Watch my run right now with'))
            return false;
        else if (this.text.includes('Achieved a new personal record with'))
            return false;
        else
            return true;
    }

    //didn't use
    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return "";
    }

    //Parses out an activity and returns the event of the tweet when called, activity has to include km or mi
    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        var i = 0;
        var activity = 'unknown';
        if (this.text.search(' mi ') >= 0)
            i = this.text.search(' mi ');
        else if (this.text.search(' km ') >= 0)
            i = this.text.search(' km ');
        
        if (i >= 0) 
            activity = this.text.slice(i+4).split(" ")[0]; //skip over distance and take first verb after

        if (activity == '')
            activity = "unknown";

        return activity;
    }

    //takes distance out of written text, converts kilometers to miles when applicable.
    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        var i = this.text.search(' mi ')
        if (i >= 0) {
            if (this.text[i-5] != ' ')
                return +this.text.slice(i-5,i);
            else
                return +this.text.slice(i-4,i);
        }
        else
            i = this.text.search(' km ')
            if (i >= 0) {
                if (this.text[i-5] != ' ')
                    return +this.text.slice(i-5,i) / 1.609;
                else
                    return +this.text.slice(i-4,i) / 1.609;
            }
            else
                return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        var text = this.text;
        var link = this.text.slice(this.text.search("https")).split(' ')[0];
        text = text.replace(link, `<a href="${link}">${link}</a>`);
        return `<tr><td>${rowNumber}</td><td>${this.activityType}</td><td>${text}</td></tr>`;
    }
}