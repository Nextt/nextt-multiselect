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
    var jqSearchInput = $('<input type="text" class="searchInput" />');
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

      var keyList = Object.keys(opts.items);
      var nextItem = Nextt.MultiselectController._nextItem(opts, keyList);
      
      //storing data used later for lazy-loading elements
      jqListContainer.data('options', opts);
      jqListContainer.data('nextItem', nextItem);
      jqListContainer.data('keyList', keyList);
      jqListContainer.data('originalKeyList', keyList);
      
      // rendering first chunk of items
      jqListContainer.append(Nextt.MultiselectController._render(0, keyList, opts));
    } else {
      jqListContainer.append('<li class="multiselect-empty-msg">No items to show</li>');
    }

    //showing how many items are initially checked
    var nrItemsSelected = $('<span class="nr-items" />');
    if (opts && opts.checked) {
      nrItemsSelected.html(opts.checked.length);
    } else {
      nrItemsSelected.html('0');
    }
    var itemsSelectedMessage = $('<span class="items-selected" />').append(nrItemsSelected).append(' selected');
    jqTriggerContainer.append(itemsSelectedMessage);

    // binding events
    jqListContainer.delegate(':checkbox', 'change', Nextt.MultiselectController._refresh);
    jqListContainer.bind('scroll', Nextt.MultiselectController._scroll);
    jqSearchInput.bind('keyup', Nextt.MultiselectController._search);
    jqCheckAllLink.bind('click', Nextt.MultiselectController._checkAll);
    jqUncheckAllLink.bind('click', Nextt.MultiselectController._uncheckAll);
  },

  _scroll : function (){
    var jqListContainer = $(this);
    if (jqListContainer[0].scrollHeight - jqListContainer.scrollTop() > 500) { 
      return;
    }

    var nextItem = jqListContainer.data('nextItem'),
        opts = jqListContainer.data('options'),
        keyList = jqListContainer.data('keyList');

    if (opts && opts.limit && nextItem < keyList.length ) {
      var nextLimit = nextItem + opts.limit;
      var listHTML = Nextt.MultiselectController._render(nextItem, keyList, opts);
      jqListContainer.append(listHTML);
      jqListContainer.data('nextItem', nextLimit);
    }
  },

  _render: function (firstItem, keyList, opts) {
    var renderLimit = null;
    var remainder = keyList.length - firstItem;
    if (opts.limit) {
      renderLimit = (opts.limit > remainder) ? remainder : opts.limit;
    } else {
      renderLimit = keyList.length;
    }

    var listHTML = '';
    for ( var i = firstItem; i < firstItem + renderLimit; i++ ){
      var checked = '';
      if ( $.inArray(keyList[i], opts.checked) >= 0 ) {
        checked = ' checked="checked"';
      }
      listHTML += '<li><label><input type="checkbox" value="' + keyList[i] + '" ' + checked + '/>' + opts.items[keyList[i]] + '</label></li>';
    }
    return listHTML;
  },

  _search: function () {
    var jqListContainer = $(this).parent().siblings('ul'),
        opts = jqListContainer.data('options'),
        searchValue = $(this).val(),
        searchRegex = new RegExp(searchValue, "i");

    var filteredKeyList = $.map(opts.items, function (value, key) {
      if (searchRegex.test(value)) {
        return key;
      }
    });

    var listHTML = Nextt.MultiselectController._render(0, filteredKeyList, opts);
    var filteredNextItem = Nextt.MultiselectController._nextItem(opts, filteredKeyList);

    jqListContainer.data('keyList', filteredKeyList);
    jqListContainer.data('nextItem', filteredNextItem);
    
    jqListContainer.empty().append(listHTML);
    jqListContainer.scrollTop(0);
  },

  _refresh: function (e) {
    var jqTarget = $(e.target),
        jqListContainer = jqTarget.closest('ul'),
        opts = jqListContainer.data("options"),
        checked = opts.checked,
        value = jqTarget.val();
    
    if (jqTarget.attr('checked')) {
      if ($.inArray(value, opts.checked) === -1) {
        checked.push(value);
      }
    } else {
      var index = $.inArray(value, checked);
      if ($.inArray(value, opts.checked) >= 0) {
        checked.splice(index, 1);
      }
    }
    $('.multiselect-trigger-container .nr-items').html(checked.length);
    jqListContainer.data("options", opts);
  },

  _nextItem: function (opts, keyList) {
    return opts.limit && opts.limit < keyList.length ? opts.limit : keyList.length;
  },

  _checkAll: function () {
    var jqListContainer = $(this).parent().siblings('ul');
    var opts = jqListContainer.data('options');
    opts.checked = jqListContainer.data('originalKeyList');
    $(this).parent().siblings('ul').find(':checkbox').attr('checked', true).trigger('change');
  },

  _uncheckAll: function () {
    $(this).parent().siblings('ul').data('options').checked = [];
    $(this).parent().siblings('ul').find(':checkbox').attr('checked', false).trigger('change');
  },

  // val() method
  addItems: function (itemMap){

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