require('../src/nextt-object');
require('../src/nextt-multiselect');

describe("Selection", function () {
  
  var fixture = '<div id="multiselect"></div>',
      jqElem,
      jqListContainer,
      jqSearchInput;

  beforeEach(function(){
    $('body').html(fixture);
  });
  
  describe("on initialization with checked items", function() {
    beforeEach(function(){
      opts = {
        items : {
          '01' : 'Abacate',
          '02' : 'Laranja',
          '03' : 'Abacaxi',
          '04' : 'Maçã',
          '05' : 'Banana',
          '06' : 'Melão'
        },

        checked : ['02', '04'],

        limit: 4
      };

      jqElem = $('#multiselect').nexttMultiselect(opts);
      jqListContainer = $(".multiselect-dropdown-container ul");
    });

    it("must correctly check items", function(){
      var checkedItems = jqElem.find(':checked');
      expect(opts.checked.length).toEqual(checkedItems.size());
      checkedItems.each(function() {
        expect( $.inArray(this.value, opts.checked) >=0 ).toBeTruthy();
      });

    });

    it("must show how many items are selected", function () {
      var itemsSelectedMessage = jqElem.find('.multiselect-trigger-container span.nr-items').html()
      expect(itemsSelectedMessage).toEqual('2');
    });

    it("must update the number of checked items when an item is checked", function () {
      var firstCheckbox = jqListContainer.find(':checkbox').eq(0);
      firstCheckbox.attr('checked', true);
      firstCheckbox.trigger('change');
      var itemsSelected = jqElem.find('.multiselect-trigger-container span.nr-items').html();

      expect(itemsSelected).toEqual('3');
    });

    // there must be bug on node jquery, the checkbox cannot be unchecked
    xit("must update the number of checked items when an item is unchecked", function () {
      var secondCheckbox = jqListContainer.find(':checkbox').eq(1);
      secondCheckbox.removeAttr('checked');
      secondCheckbox.trigger('change');
      var itemsSelected = jqElem.find('.multiselect-trigger-container span.nr-items').html();

      expect(itemsSelected).toEqual('1');
    });

    it('check all checkbox must check all visible items', function () {
      $('.multiselect-action-container .multiselect-checkall-link').trigger('click');
      jqListContainer.find(':checkbox').each(function () {
        expect( $(this) ).toBeChecked();
      });
    });

    it('check all checkbox must check all items', function () {
      $('.multiselect-action-container .multiselect-checkall-link').trigger('click');
      var opts = jqListContainer.data("options");
      var keyList = jqListContainer.data("originalKeyList");

      expect(opts.checked.length).toEqual(keyList.length);
    });

    it('uncheck all checkbox must uncheck all items', function () {
      $('.multiselect-action-container .multiselect-uncheckall-link').trigger('click');
      jqListContainer.find(':checkbox').each(function () {
        expect( $(this) ).not.toBeChecked();
      });
    });

  });
  
});