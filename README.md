# jQuery.searchTable.js
===================
Create a search in a datatable or any custom table. With this plugin you can search in the colomns of the table with easy configuration.

## Install
Include jQuery (If not included) and src file
```
<script type='text/javascipt' src='js/jQuery.js'></script>
<script type='text/javascipt' src='js/jQuery.searchTable.js'></script>
```
And finally call the plugin with the search query
```
$("#mytable").searchTable({
        query: searchQuery
        //.. add your sutiable options :)
 })
```

## Methods
```javascript
$("table").searchTable (options, callback);
// The Above methods is default passing options as a object with your desired options and callback(optional) as a function which will return you an object of resutls see below in examples section

$("table").searchTable ("clearSearch");
// Calling the Above method will clear the search and remove highlights if they are enabled

$("table").searchTable ("clearHighlights");
// Calling the Above method will ONLY CLEAR THE Highlights if they are enabled
``` 

## Defaults
```javascript
{
    query: "", // search query
    highlight: true, //hightlight results
    highlightBg: "#FF0", // highlight background 
    highlightColor: "#000", // highlight text color
    hideOthers: true, // hide the rows in which results are none
    emptyResultsMesage: "No results Found for your query", // message if no results found (works only when hideOthers is set to true)
    clearSearchButton: false, // clear search button with message if no results found (works only when hideOthers is set to true)
    notToSearchIn: "no-search", //  a class not to search in that means if you want to prevent a column in a pirticular row then just add this class to the column.
    columnsToSearch: "all" // here you can define which columns you want to search by default value is all (string) and to define columns you need to send an array with the column index like [0,5] now it will only search the column with the provied index
}
``` 

## Examples

Using On a search form with jQuery submit method
```javascript
var form = $("#myform"),
    table = $("#mytable");
form.on("submit", function(e) {
    e.preventDefault();
    var searchQuery = $(this).find("#searchInput").val();
    if ($.trim(searchQuery) != "") {
        table.searchTable({
            query: searchQuery
            //.. add your sutiable options :)
        })
    }
})
```

Using On a search input with jQuery keyup method
```javascript
var input = $("#searchInput"),
    table = $("#mytable");
input.on("keyup", function(e) {
    e.preventDefault();
    var searchQuery = $(this).val();
    if ($.trim(searchQuery) != "") {
        table.searchTable({
            query: searchQuery
            //.. add your sutiable options :)
        })
    }
   /* 
    // Tip: For a better experince you can clear the table
    // search by calling the clearSearch method on the table
    // when value is empty.
    else {
        table.searchTable("clearSearch")
    }
    */
})
```

Using With Callbacks
```javascript
var input = $("#searchInput"),
    table = $("#mytable");
input.on("keyup", function(e) {
    e.preventDefault();
    var searchQuery = $(this).val();
    if ($.trim(searchQuery) != "") {
        table.searchTable({
            query: searchQuery
            //.. add your sutiable options :)
        },function(result){
            // the result will return you an Object ({tr:[elements],td:[elemetns]})
            // these elements are those in which the result is found means they contains matches
        
        })
    }

})
```

