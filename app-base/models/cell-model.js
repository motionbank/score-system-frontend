var BaseModel = require('models/base/model'),
	config = require('config/config');

module.exports = BaseModel.extend({

	idAttribute : 'connection_id', // cells are overriden per connection, so make this the "id"

	defaults : {
		title 		: 'Missing Title Here',
		description : 'Missing description',
		type 		: 'missing-type',
		poster 		: null,
		sets 		: [], // sets it belongs to ... really?
		extra 		: {} // per connection settings: x,y,width,height
		// each field in ```fields``` [] will be mapped to 
		// ```field_key : field_value```
		// overriding the default values on the way ...
	},

	modeltype : 'cell',

	// attributes that can't be overwritten in fields
	lockedAttributes : {
		type   : null,
		sets   : null,
		extra  : null,
		fields : null,
		id 	   : null,
		connection_id : null
	},

	// check if this cell has the sticky flag set
	// TODO: just use getFlag('sticky') instead
	isSticky : function () {
		return this.getFlag('sticky');
	},

	// checks if an attribute is present and either 'true' or '1'
	getFlag : function (flag) {
		return /true|1/i.test(this.get(flag));
	},

	// sets attributes and applies overrides set via fields
	set : function ( opts ) {
		// override some attributes per set<->cell connection
		if ( opts && typeof opts === 'object' && 'fields' in opts ) {
			_.each( opts.fields, function(field){
				if ( field && field.value && field.name && !( field.name in this.lockedAttributes ) ) {
					opts[field.name] = field.value;
				}
			}, this);
			BaseModel.prototype.set.apply(this,[opts]);
		} else {
			BaseModel.prototype.set.apply(this,arguments);
		}
	},

	getPosterImageURL : function () {
		return 'http://' +
				config.cloudFront.fileHost + 
				config.cloudFront.baseUrl + 
				'/'+
				//(this.get('type') === 'set-link' ? 'sets' : 'cells')+
				'cells'+
				'/poster/full/' +
				this.get('poster');
	}

});