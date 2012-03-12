Nextt Multiselect jQuery Plugin
================================

##How to use

>Given a div element with the id 'multiselect', initialize it like this:

<pre>
$('#multiselect').nexttMultiselect({

  items: {
    'id1': 'label1',
    'id2': 'label2',
    'id3': 'label3'
  },

  limit: 100, // <strong>optional - lazy-loads if there are more item than limit</strong>

  checked: [ 'id1'] // <strong>automatically checks these items</strong>

});
</pre>

>If you need to update the checked items, there is an 'option' method in the plugin:

<pre>
$('#multiselect').nexttMultiselect('options', {

  checked: [ 'id3'] // <strong>unchecks the others, check this one</strong>

});
</pre>

>If you need to update the items you can replace them with the 'options' too:

<pre>
$('#multiselect').nexttMultiselect({

  items: {
    'id4': 'label4'
  },

});
</pre>

> Is possible to update both, items and checked items, with the options method:

<pre>
$('#multiselect').nexttMultiselect('options', {

  items: {
    'id3': 'label3'
    'id4': 'label4'
  },

  checked: [ 'id3', 'id11' ] // <strong>invalid items are not checked, duh</strong>

});
</pre>


##Development

* run > **npm install grunt -g** to install the grunt build tool
* then **npm install** to install development dependencies

* run tests with > **grunt jasmine**

* just run > **grunt** to lint, concatenate and minify