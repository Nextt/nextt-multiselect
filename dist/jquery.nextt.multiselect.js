/**
 * TODO
 */
(function($){
/**
 * Gently borrowed from http://stackoverflow.com/questions/208016/how-to-list-the-properties-of-a-javascript-object
 */
 
Object.keys = Object.keys || (function () {
    var hasOwnProp = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
        DontEnums = [ 
            'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty',
            'isPrototypeOf', 'propertyIsEnumerable', 'constructor'
        ],
        DontEnumsLength = DontEnums.length;

    return function (o) {
        if (typeof o !== "object" && typeof o !== "function" || o === null) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var result = [];
        for (var name in o) {
            if (hasOwnProp.call(o, name)) {
                result.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (hasOwnProp.call(o, DontEnums[i])) {
                    result.push(DontEnums[i]);
                }
            }   
        }

        return result;
    };
}());
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
      if (typeof(opts.items) !== 'object'){
        throw "Nextt Multiselect - Invalid initialization params - items should be a map";
      }
      jqListContainer.data('options', opts);

      var listHTML = '';
      
      var keyList = Object.keys(opts.items);
      var limit = opts.limit ? opts.limit : keyList.length;
      jqListContainer.data('nextItem', limit);
      jqListContainer.data('keyList', keyList);

      for (var i = 0; i < limit; i++ ){
        var checked = '';
        if ($.inArray(keyList[i], opts.checked) >= 0){
          checked = ' checked="checked"';
        }

        var itemHTML = '<li><label><input type="checkbox" value="' + keyList[i] + '" ' + checked + '/>' + opts.items[keyList[i]] + '</label></li>';
        listHTML += itemHTML;
      }
      jqListContainer.append(listHTML);
    } else {
      jqListContainer.append('<li class="multiselect-empty-msg">No items to show</li>');
    }

    var nrItemsSelected = $('<span class="nr-items" />');
    if (opts && opts.checked) {
      nrItemsSelected.html(opts.checked.length);
    } else {
      nrItemsSelected.html('0');
    }
    var itemsSelectedMessage = $('<span class="items-selected" />').append(nrItemsSelected).append(' selected');
    jqTriggerContainer.append(itemsSelectedMessage);


    jqListContainer.bind('scroll', Nextt.MultiselectController._scroll);
  },

  _scroll : function (){
    var jqListContainer = $(this);
    if (jqListContainer[0].scrollHeight - jqListContainer.scrollTop() > 500) { 
      return;
    }

    var nextItem = jqListContainer.data('nextItem'),
        opts = jqListContainer.data('options'),
        keyList = jqListContainer.data('keyList');

    if (opts && opts.limit &&  keyList.length !== nextItem ) {
      console.log('irra!');
      
      var nextLimit = nextItem + opts.limit;
      var listHTML = '';
      for (var i = nextItem; i < nextLimit; i++ ){
        var checked = '';
        if ($.inArray(keyList[i], opts.checked) >= 0){
          checked = ' checked="checked"';
        }

        var itemHTML = '<li><label><input type="checkbox" value="' + keyList[i] + '" ' + checked + '/>' + opts.items[keyList[i]] + '</label></li>';
        listHTML += itemHTML;
      }
      jqListContainer.append(listHTML);

      jqListContainer.data('nextItem', nextLimit);
    }

      
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
      $.error( 'Method ' +  method + ' does not exist on jquery.nextt.multiselect' );
    }

  }
});
})(jQuery);