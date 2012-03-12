var Nextt = Nextt || {};

Nextt.MultiselectController = {

  init : function (opts){
    var jqThis = $(this).addClass('multiselect'),
        jqTriggerContainer = $('<div class="multiselect-trigger-container" />'),
        jqDropdownContainer = $('<div class="multiselect-dropdown-container" />'),
        jqActionContainer = $('<div class="multiselect-action-container" />'),
        jqListContainer = $("<ul />"),
        jqSearchInput = $('<input type="text" class="search-input" />'),
        jqCheckAllLink = $('<a href="javascript:void(0)" class="multiselect-checkall-link">Check All</a>'),
        jqUncheckAllLink = $('<a href="javascript:void(0)" class="multiselect-uncheckall-link">Uncheck All</a>'),
        jqItemsSelected = $('<span class="nr-items" />'),
        jqItemsSelectedMessage = $('<span class="items-selected" />');

    //append everybody to the DOM.
    jqItemsSelectedMessage.append( jqItemsSelected, ' selected');
    jqTriggerContainer.append( jqItemsSelectedMessage );
    jqActionContainer.append( jqSearchInput, jqCheckAllLink, jqUncheckAllLink );
    jqDropdownContainer.append( jqActionContainer, jqListContainer );
    jqThis.append( jqTriggerContainer, jqDropdownContainer );

    //storing options in the most convenient element
    jqListContainer.data('options', opts);

    //initializing and rendering items
    Nextt.MultiselectHelper._initializeList(opts, jqListContainer);

    jqDropdownContainer.hide();
    jqTriggerContainer.click(function () {
      jqDropdownContainer.toggle();
    });

    jqListContainer.delegate(':checkbox', 'change', Nextt.MultiselectHelper._refresh);
    jqListContainer.bind('scroll', Nextt.MultiselectHelper._scroll);
    jqSearchInput.bind('keyup', Nextt.MultiselectHelper._search);
    jqCheckAllLink.bind('click', Nextt.MultiselectHelper._checkAll);
    jqUncheckAllLink.bind('click', Nextt.MultiselectHelper._uncheckAll);
  },

  options: function (newOpts) {
    if (newOpts) {
      var jqListContainer = $(this).find('.multiselect-dropdown-container ul');
      var opts = jqListContainer.data('options');
      $.extend(opts, newOpts);
      Nextt.MultiselectHelper._initializeList(opts, jqListContainer);
    }
  }
};

Nextt.MultiselectHelper = {

  _initializeList: function (opts, jqListContainer) {
    Nextt.MultiselectHelper._initializeItems(opts, jqListContainer);
    Nextt.MultiselectHelper._initializeChecked(opts, jqListContainer);
    Nextt.MultiselectHelper._updateCheckedCounter(jqListContainer);
  },

  _initializeItems: function (opts, jqListContainer) {
    if (opts.items) {
      
      if (typeof(opts.items) !== 'object'){
        throw "Nextt Multiselect - Invalid initialization params - items should be a map";
      }

      var keyList = Object.keys(opts.items),
          nextItem = Nextt.MultiselectHelper._nextItem(opts, keyList);

      //storing data used later for lazy-loading elements
      jqListContainer.data('nextItem', nextItem);
      jqListContainer.data('keyList', keyList);
      jqListContainer.data('originalKeyList', keyList);

      // rendering first chunk of items
      jqListContainer.empty();
      Nextt.MultiselectHelper._renderChunk(jqListContainer, 0, keyList, opts);
    } else {
      jqListContainer.append('<li class="multiselect-empty-msg">No items to show</li>');
    }
  },

  _initializeChecked : function (opts, jqListContainer) {
    if (opts) {
      var keyList = jqListContainer.data('keyList');
      var checked = opts.checked || [];
      var cleanChecked = $.map(checked, function (value, index) {
        if ($.inArray(value, keyList) >= 0) {
          return value;
        }
      });
      opts.checked = cleanChecked;
    }
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
      Nextt.MultiselectHelper._renderChunk(jqListContainer, nextItem, keyList, opts);
      jqListContainer.data('nextItem', nextLimit);
    }
  },

  _renderChunk: function (jqListContainer, firstItem, keyList, opts) {
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
    jqListContainer.append(listHTML);
  },

  _search: function () {
    var jqListContainer = $(this).parent().siblings('ul'),
        opts = jqListContainer.data('options'),
        searchValue = $.trim( $(this).val() ),
        searchRegex = new RegExp(searchValue, "i");

    var filteredKeyList = $.map(opts.items, function (value, key) {
      if ( searchRegex.test( value.toLowerCase().removeDiacritics() ) ) {
        return key;
      }
    });

    var filteredNextItem = Nextt.MultiselectHelper._nextItem(opts, filteredKeyList);

    jqListContainer.data('keyList', filteredKeyList);
    jqListContainer.data('nextItem', filteredNextItem);
    
    jqListContainer.empty();
    Nextt.MultiselectHelper._renderChunk(jqListContainer, 0, filteredKeyList, opts);
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
    Nextt.MultiselectHelper._updateCheckedCounter(jqListContainer);
  },

  _updateCheckedCounter: function (jqListContainer) {
    var checkedCounter = jqListContainer.data('options').checked.length;
    jqListContainer.parent().siblings('.multiselect-trigger-container').find('.nr-items').html(checkedCounter);
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
    var jqListContainer = $(this).parent().siblings('ul');
    jqListContainer.data('options').checked = [];
    jqListContainer.find(':checkbox').attr('checked', false).trigger('change');
  }
};

$.extend($.fn, {

  nexttMultiselect : function( method ) {
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