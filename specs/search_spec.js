require('../src/nextt-object');
require('../src/nextt-string');
require('../src/nextt-multiselect');

describe("Search", function () {

  var fixture = '<div id="multiselect"></div>',
      jqElem,
      jqListContainer,
      jqSearchInput;

  beforeEach(function(){
    $('body').html(fixture);
  });

  describe('with diacritics', function () {
    beforeEach(function () {
      jqElem = $('#multiselect').nexttMultiselect({
        items : { 
          '01': 'itém',
          '02': 'itêm',
          '03': 'cà',
          '04': 'cã',
          '05': 'cã ítem',
          '06': 'SÁ'
        }
      });
      jqListContainer = $(".multiselect-dropdown-container ul");
      jqSearchInput = jqElem.find('.search-input');
    });

    it('must find items with acute and circ in middle of words', function () {
      jqSearchInput.val('item');
      jqSearchInput.trigger('keyup');
      expect(jqListContainer.find('li').size()).toEqual(3);
    });

    it('must find items with ` and ~ i  at end of words', function () {
      jqSearchInput.val('ca');
      jqSearchInput.trigger('keyup');
      expect(jqListContainer.find('li').size()).toEqual(3);
    });
    
    it('must find items with more than one word', function () {
      jqSearchInput.val('ca item');
      jqSearchInput.trigger('keyup');
      expect(jqListContainer.find('li').size()).toEqual(1);
    });

    it('must find items with upper cases', function () {
      jqSearchInput.val('sa');
      jqSearchInput.trigger('keyup');
      expect(jqListContainer.find('li').size()).toEqual(1);
    });

    it('must find items even if search input has spaces at start or end', function () {
      jqSearchInput.val(' item ');
      jqSearchInput.trigger('keyup');
      expect(jqListContainer.find('li').size()).toEqual(3);
    });
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