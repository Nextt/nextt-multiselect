require('../src/nextt-object');
require('../src/nextt-multiselect');

describe("Limit", function () {
  
  var fixture = '<div id="multiselect"></div>',
      jqElem,
      jqListContainer,
      jqSearchInput;

  beforeEach(function(){
    $('body').html(fixture);
  });

  describe("on initialization with more items then rendering limit", function() {
    
    beforeEach(function(){
      var items = {};
      for (var i = 0; i < 200; i++) {
        items[ 'item' + i ] = 'value' + i;
      }

      opts = {
        items : items,
        limit : 100
      };

      jqElem = $('#multiselect').nexttMultiselect(opts);
      jqListContainer = $(".multiselect-dropdown-container ul");
    });

    it("must initially render only the number of items defined by limit", function(){
      expect( jqListContainer.find("> li").size() ).toEqual(100);
    });

    it ("must store next item to be rendered", function () {
      expect(jqListContainer.data('nextItem')).toEqual(100);
    });

    it ("must store items keys list", function () {
      expect(jqListContainer.data('keyList').length).toEqual(200);
    });

  });
  
});

