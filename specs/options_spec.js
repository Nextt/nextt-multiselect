require('../src/nextt-object');
require('../src/nextt-multiselect');

describe("Options", function () {
  
  var fixture = '<div id="multiselect"></div>',
      jqElem,
      jqListContainer,
      jqSearchInput;

  beforeEach(function(){
    $('body').html(fixture);
    jqElem = $('#multiselect').nexttMultiselect({
      items : {
        '01' : 'Abacate',
        '02' : 'Laranja',
        '03' : 'Abacaxi'
      }
    });
    jqListContainer = $(".multiselect-dropdown-container ul");
  });
  
  describe("when new options have other items", function() {

    it("must replace items", function() {
      jqElem.nexttMultiselect('options', {
        items : {
          '04' : 'Mamão'
        }
      });

      expect(jqListContainer.find('li').size()).toEqual(1);
    });
  });


  describe("when new options have other checked items", function () {

    beforeEach(function () {
      jqElem.nexttMultiselect('options', {
        checked : [ '03', '01' ]
      });
    });

    it('must refresh checked items', function () {
      expect(jqListContainer.find(':checkbox:checked').size()).toEqual(2);
    });

    it('must refresh checked items message', function () {
      expect(jqElem.find('.nr-items')).toHaveHtml('2');
    });
      
  });

});