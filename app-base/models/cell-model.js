var BaseModel = require('models/base/model'),
	config = require('config/config');

module.exports = BaseModel.extend({

	idAttribute : 'id',

	defaults : {
		title 		: 'Missing Title Here',
		description : 'Missing description',
		type 		: 'missing-type',
		poster 		: null,
		sets 		: [], // sets it belongs to ... really?
		extra 		: {} // per connection settings: x,y,width,height
		// each field in ```additional_fields``` [] will be mapped to 
		// ```field_key : field_value```
		// overriding the default values on the way ...
	},

	modeltype : 'cell',

	// attributes that can't be overwritten in fields
	lockedAttributes : {
		type   : null,
		sets   : null,
		//extra  : null,
		additional_fields : null,
		id 	   : null
		//connection_id : null
	},

	// check if this cell has the sticky flag set
	// TODO: just use getFlag('sticky') instead
	isSticky : function () {
		return this.getFlag('sticky');
	},

	// checks if an attribute is present and not false, "false", 0, "0", "", null, undefined, NaN
	getFlag : function (flag) {
		var val = this.get(flag);
		if (!val) return false;  // false, 0, "", null, undefined, NaN
		return !(/false|0/i.test(val));
	},

	// sets attributes and applies overrides set via fields
	set : function ( opts ){
		// override some attributes per set<->cell connection
		if ( opts && typeof opts === 'object' && 'additional_fields' in opts ) {
			_.each( opts.additional_fields, function(value, name){
				if ( value && name && !( name in this.lockedAttributes ) ) {
					opts[name] = value;
				}
			}, this);
			BaseModel.prototype.set.apply(this,[opts]);
		} else {
			BaseModel.prototype.set.apply(this,arguments);
		}
	},

	getPosterImageURL : function () {
		var posterURL = this.get('poster_image').url;
		if ( posterURL.indexOf('/assets/fallback/') == 0 ) return '';
		if ( posterURL.indexOf('http') == 0 ) return posterURL;
		return 'http://' + config.assetHost + this.get('poster_image').url;
	},

	getDimensions : function ()  {
		//return this.get('extra'); // old backend
		return {
			x : this.get('x'),
			y : this.get('y'),
			width : this.get('width'),
			height : this.get('height')
		};
	},

	getID : function () {
		//return this.get('connection_id'); // old backend
		return this.get('id');
	},

	// get all attributes with a certain prefix
	// returned keys are without the prefix
	getPrefixAttributes : function (prefix) {
		attribs = {};
		if (prefix) {
			var rx = new RegExp('^' + prefix, 'i');
			_.each(this.attributes, function(value, name) {
				if ( rx.test(name) ) {
					attribs[name.replace(rx, '')] = value;
				}
			});
		}
		return attribs;
	}

});