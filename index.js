$(document).ready(function(){
    
    function search(filter){
        var result = testData;
        
        if(filter && filter.length){
            var regex = new RegExp(filter, "i")
            result = testData.filter(function(item){
                return regex.test(item.text);
            });
        }       
        
        return result.slice(0, 10);
    }
    
    document.mockGet = function(url, data) {
        var dfd = $.Deferred()
        
        console.log("getting: " + url + "?" + $.param(data));
        setTimeout(function(){
            var results = search(data.search);
            dfd.resolve(results);
        }, 100)
        
        return dfd.promise();        
    }
    
    $("[data-bee-control=autocomplete]").autocomplete({
        src: "some/url/endpoint",
        search: {
            title: "Requests Search",
            src: "some/url/endpoint.html"
        }
    })
})