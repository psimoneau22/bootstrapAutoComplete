$(document).ready(function(){
    
    var templates =  {
        
        form:      '<div class="form-inline">' +
                        '<div class="form-group">' +
                            '<div class="input-group">' +
                                '<input type="text" class="form-control autocomplete-display">' +
                                '<input type="hidden" class="autocomplete-value">' +
                                '<div class="input-group-addon autocomplete-search">' +
                                    '<span class="glyphicon glyphicon-search">' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>',
        
        suggest:    '<div class="autocomplete-suggest dropdown open" />',
        
        modal:      '<div class="modal fade autocomplete-search-modal" tabindex="-1">' +
                        '<div class="modal-dialog">' +
                            '<div class="modal-content">' +
                            '<div class="modal-header">' +
                                '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>' +
                                '<h4 class="modal-title" >' +
                            '</div>' +
                            '<div class="modal-body">' +
                            '<div class="modal-footer">' +
                                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                                '<button type="button" class="btn btn-primary">Save changes</button>' +
                            '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
    };    
    
    $.widget("beeline.autocomplete", {
        options: {
            
        },
        
        _create: function(){
            this.root = $('<div class="autocomplete">')  
            this.form = $(templates.form).appendTo(this.root);
            this.suggest = $(templates.suggest).appendTo(this.root);
            this.searchModal = $(templates.modal).appendTo(this.root);
                            
            this.display = this.form.find('input.autocomplete-display');
            this.value = this.form.find('input.autocomplete-value');
              
            this.searchModal.find(".modal-title").text(this.options.search.title);
            this.searchModal.find(".modal-body").load(this.options.search.src);            
            
            this._on(this.element, {
                "click input.autocomplete-display": this._handleInputClick,
                "keyup input.autocomplete-display": this._createHandleKeyup(),
                "click a.autocomplete-suggest-item": this._handleSuggestionClick,
                "click div.autocomplete-search": this._handleRequestSearch
            });
            
            this._on(document, {
                "click": this._handleOutsideClick
            });                                 
                          
            this.element.append(this.root).data("source", this.options.src)
        },
        
        _handleInputClick: function(e){
            console.log("display clicked");
            this._search();
            e.stopPropagation();
        },
        
        _createHandleKeyup: function (){
            var searchTimeout;
            return function(){
                console.log("display keyup");
                clearTimeout(searchTimeout)
                searchTimeout = setTimeout(this._search.bind(this))
            }.bind(this)
        },
        
        _handleOutsideClick: function(){
            console.log("outside click");
            this._updateSuggestion();
        }, 
        
        _handleSuggestionClick: function(e){
            console.log("suggestion click");
            this.value.val($(e.target).data("value"));
            this.display.val($(e.target).text());            
        },
        
        _handleRequestSearch: function(e){
            console.log("search click");
            this.searchModal.modal();                        
        },
        
        _search: function(){
            var filter = this.display.val();
            document.mockGet(this.options.src, { search: filter }).then(this._updateSuggestion.bind(this));
        },
        
        _updateSuggestion: function(data){
            this.suggest.empty();
            if(data && data.length){
                var list = $('<ul class="dropdown-menu">')
                $.each(data, function(index, item){
                    
                    $('<li>')
                        .append(
                            $('<a href="#" class="autocomplete-suggest-item">')
                                .text(item.text)
                                .data("value", item.value)
                        )
                        .appendTo(list)
                });
                this.suggest.append(list);
            }
        }
    })
})