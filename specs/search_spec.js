require('../src/nextt-object');
require('../src/nextt-multiselect');

describe("Search", function () {

  var fixture = '<div id="multiselect"></div>',
      jqElem,
      jqListContainer,
      jqSearchInput;

  beforeEach(function(){
    $('body').html(fixture);
  });

  describe("with limit", function () {

    beforeEach(function(){
      var items = {};
      for (var i = 0; i < 20; i++) {
        items[ 'item' + i ] = 'value' + i;
      }
      jqElem = $('#multiselect').nexttMultiselect({
        items : items,
        limit : 5
      });

      jqListContainer = $(".multiselect-dropdown-container ul");
      jqSearchInput = jqElem.find('.search-input');
    });

    it("must render only items that matches the search input but no more than limit", function () {
      jqSearchInput.val('value1');
      jqSearchInput.trigger('keyup');
      expect(jqListContainer.find('li').size()).toEqual(5);
    });
    
  });

  describe("without limit", function () {

    beforeEach(function(){
      var items = {};
      for (var i = 0; i < 20; i++) {
        items[ 'item' + i ] = 'value' + i;
      }
      jqElem = $('#multiselect').nexttMultiselect({
        items : items,
        limit: 100
      });

      jqListContainer = $(".multiselect-dropdown-container ul");
      jqSearchInput = jqElem.find('.search-input');
    });

    it("must render only items that matches the search input", function () {
      jqSearchInput.val('value1');
      jqSearchInput.trigger('keyup');
      
      expect(jqListContainer.find('li').size()).toEqual(11);
    });
  
  });

});