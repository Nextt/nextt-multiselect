require('../../src/nextt-object');
require('../../src/nextt-multiselect');

var fixture = '<div id="multiselect"></div>';
beforeEach(function(){
		$('body').html(fixture);
});


describe('Before starting', function(){

	beforeEach(function(){
		$('body').html(fixture);
	});
	
	it("must have Jquery in the context", function(){
		expect(jQuery).toBeTruthy();
	});

	it("must have added method nexttMultiselect to the effin", function(){
		expect($.fn.nexttMultiselect).toBeTruthy();
	});

    xit("must keep the chaining", function () { 
    	var jqSelector = $('div').nexttMultiselect();
    	expect(jqSelector).toBe("div");
    });
});

describe("On clean initialization", function(){

	beforeEach(function(){
		jqElem = $('#multiselect').nexttMultiselect();
	});

	it("must have added trigger-container", function(){
		expect(jqElem).toContain('div.multiselect-trigger-container');
		//TODO test click event binding
	});

	it("must have added dropdown-container", function(){
		expect(jqElem).toContain('div.multiselect-dropdown-container');
	});

	it("must have added list container", function(){
		expect(jqElem).toContain('div.multiselect-dropdown-container ul');
		//TODO test scroll event binding
	});

	it("must have added empty message",function(){
		expect(jqElem).toContain('div.multiselect-dropdown-container ul li.multiselect-empty-msg');
	});

	it("must have added action-container", function(){
		expect(jqElem).toContain('div.multiselect-action-container');
	});

	it("must have added search input", function(){
		expect(jqElem).toContain('div.multiselect-action-container input');
		//TODO test keyup event binding
	});

	it("must have added check all link", function(){
		expect(jqElem).toContain('div.multiselect-action-container a.multiselect-checkall-link');
		//TODO test click event binding
	});

	it("must have added uncheckall link", function(){
		expect(jqElem).toContain('div.multiselect-action-container a.multiselect-uncheckall-link');
		//TODO test click event binding
	});


});

describe("On improper initialization", function(){

	it ("must throw an exception when items are not a map", function(){
		expect(function(){
			$('#multiselect').nexttMultiselect({items: 'Not and map'});
		}).toThrow('Nextt Multiselect - Invalid initialization params - items should be a map');

		expect(function(){
			$('#multiselect').nexttMultiselect({items: 1});
		}).toThrow('Nextt Multiselect - Invalid initialization params - items should be a map');

	});
});

describe("on initialization with items, no items checked, no rendering limit", function(){
	beforeEach(function(){
		opts = {
			items : {
				'01' : 'Abacate',
				'02' : 'Laranja',
				'03' : 'Abacaxi',
				'04' : 'Maçã',
				'05' : 'Banana'
			}
		};

		jqElem = $('#multiselect').nexttMultiselect(opts);
	});

	it("must create as many items as map items length", function(){
		expect(Object.keys(opts.items).length).toEqual(jqElem.find('li').size());
	});
});


describe("on initialization with items, with checked items, no rendering limit", function(){
	beforeEach(function(){
		opts = {
			items : {
				'01' : 'Abacate',
				'02' : 'Laranja',
				'03' : 'Abacaxi',
				'04' : 'Maçã',
				'05' : 'Banana'
			},

			checked : ['02', '04']
		};

		jqElem = $('#multiselect').nexttMultiselect(opts);
	});

	it("must check items 02 and 04", function(){
		var checkedItems = jqElem.find(':checked');
		expect(opts.checked.length).toEqual(checkedItems.size());
		checkedItems.each(function(){
			expect($.inArray(this.value, opts.checked)>=0).toBeTruthy();
		});

	});
});

