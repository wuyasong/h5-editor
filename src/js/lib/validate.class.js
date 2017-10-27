var validate = {
	start: function(selector){
		var value = selector.value;
		var type = selector.getAttribute('data-type');

		// console.info( this.check[type](value) );
		return this.check[type](value);
	},
	check: {
		color: function(value){
			return /^#([0-9a-fA-F]{6}){1}$/g.test(value);
		},
		px: function(value){
			return /\d{1,3}px$/g.test(value);
		},
		text: function(value){
			return !/^\s*$/.test(value);
		},
		num: function(value){
			return /\d+/.test(value);
		},
		percent: function(value){
			return /^\d{1,3}%$/g.test(value);
		}
	}
};

module.exports = validate;