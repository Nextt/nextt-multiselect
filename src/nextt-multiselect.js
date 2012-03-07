var Nextt = Nextt || {};

Nextt.MultiselectController = {

	init : function (opts){
		var jqThis = $(this);

		//create the containers
		var jqTriggerContainer = $('<div class="multiselect-trigger-container" />');
		var jqDDContainer = $('<div class="multiselect-dropdown-container" />');
		var jqActionContainer = $('<div class="multiselect-action-container" />');
		var jqListContainer = $("<ul />");

		//create action elements
		var jqSearchInput = $('<input type="text" />');
		var jqCheckAllLink = $('<a href="javascript:void(0)" class="multiselect-checkall-link">Check All</a>');
		var jqUncheckAllLink = $('<a href="javascript:void(0)" class="multiselect-uncheckall-link">Uncheck All</a>');

		//append everybody to the DOM.
		jqActionContainer.append( jqSearchInput, jqCheckAllLink, jqUncheckAllLink );
		jqDDContainer.append( jqActionContainer, jqListContainer );
		jqThis.append( jqTriggerContainer, jqDDContainer );

		//Add options
		if (opts && opts.items) {
			if (typeof(opts.items) != 'object'){
				throw "Nextt Multiselect - Invalid initialization params - items should be a map";
			}

			var limit = (! opts.limit) ? opts.items.length : (( opts.limit < opts.items.length) ? opts.limit : opts.items.length );
			var listHTML = '';
			var keyList = Object.keys(opts.items);

			for (var i = 0; i < keyList.length; i++ ){
				var checked = '';
				if ($.inArray(keyList[i], opts.checked) >= 0){
					checked = ' checked="checked"';
				}

				listHTML += '<li><label><input type="checkbox" value="'+keyList[i]+'" '+checked+'/>'+opts.items[keyList[i]]+'</label></li>';
			}
			
			jqListContainer.append(listHTML);

		} else {
			jqListContainer.append('<li class="multiselect-empty-msg">No items to show</li>');
		}


		jqListContainer.on('scroll', Nextt.MultiselectController._scroll);


		/*
		{
		...
		items : {
				'1' : 'Abacaxi',
				'2' : 'Abacate',
			},

		}
		*/
		// create DOM containers (search container, items container, selection container)
		// create DOM <input type="text"> for searching items
		// FOR each item limit 100, create DOM <label> & <input type="checkbox"> 
		// bind scroll events on container
		// bind keyup event on search field
		// bind click event, change selection label

		/*
		<div>
			<div class="...">00 selecionados</div>
			<div>
				<div>
					<input type="text" />
					<a href="javascript:void(0)">Check all</a>
					<a href="javascript:void(0)">Uncheck all</a>
				</div>
				<div>
					<label><input type="checkbox" value="{{item.key}}"><span>{{ item.value }}</span></label>
					...
				</div>
			<div>
		</div>
		*/
		
	},

	_scroll : function (){
		console.log('aaa');
	},

// val() method
	addItems : function (itemMap){

	}
};

$.extend($.fn, {

	nexttMultiselect : function( method ){

		if ( Nextt.MultiselectController[method] ) {
			return Nextt.MultiselectController[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		
		} else if ( typeof method === 'object' || ! method ) {
			
			var opts = $.extend( Nextt.MultiselectController.defaultOptions, method );
			return this.each( function() {
				Nextt.MultiselectController.init.apply( this, [opts] );
			});
		
		} else {

			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}

	}
});