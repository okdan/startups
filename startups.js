// set up parse
Parse.initialize("uEXBjWdAmacrYKRIPIO7ZMFEnDNIbqaecXzEDFMy", "emYcBeQxo3w4EYTpgwzUop2xO1L9glUHCgdN2flz");

var Startup = Parse.Object.extend("Startup");

// set up the ractive object for template handling and data binding
var ractive = new Ractive({
  el: 'startup',
  template: '#startup-template',
  data: {
  	startup: { like: '', for : ''}
  }
});

// save a new idea
ractive.on('addIdea', function(evt) {
	evt.original.preventDefault();
	var startup = new Startup();
	// TODO handle save error
	var startupData = this.get('idea');
	startupData.random = Math.random();
	startup.save(startupData);
	this.set('idea', null);
	this.set('message', 'Thanks!');
});

ractive.on('loadIdea', function() {
	window.location.hash = '';
	loadIdea();
	this.set('message', '');
});

var setStartupCallback = {
  success: function(result) {
    ractive.set('startup', result);
  }
}

var loadIdea = function(id) {
	// console.log("searching for id", id);
	var query = new Parse.Query(Startup);
	if (id) {
		query.get(id, setStartupCallback);
	} else {
		// random lookup
		var random = Math.random();
		// console.log("random lookup based on " + random);
		query.lessThanOrEqualTo("random", random).descending('random').first({
			success : function(result) {
				// console.log("less than results:", result);
				// look the other direction
				if (result) {
					ractive.set('startup', result);
				} else {
					// console.log("no luck, searching again");
					query = new Parse.Query(Startup).greaterThanOrEqualTo("random", random).ascending('random').first(setStartupCallback)
				}
			}
		});
	}
}

loadIdea(location.hash ? location.hash.replace("#","") : null);