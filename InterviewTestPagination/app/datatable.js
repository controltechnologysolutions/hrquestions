(function (angular) {
    "use strict";

    angular
        .module("datatable", [])
        .directive("todoPaginatedList", [todoPaginatedList])
        .directive("pagination", [pagination]);

    /**
     * Directive definition function of 'todoPaginatedList'.
     * 
     * TODO: correctly parametrize scope (inherited? isolated? which properties?)
     * TODO: create appropriate functions (link? controller?) and scope bindings
     * TODO: make appropriate general directive configuration (support transclusion? replace content? EAC?)
     * 
     * @returns {} directive definition object
     * 
     * @scope {
     *      data: {},
     *      columns: { "key of data": "text that show" },
     *      lengthShowDefault : length of items that are displayed
     *  }
     */
    function todoPaginatedList() {
        var directive = {
            restrict: "E", // example setup as an element only
            templateUrl: "app/templates/todo.list.paginated.html",
            scope: {
                data: '=',
                columns: '=',
                lengthShowDefault: '='
            }, // example empty isolate scope
            controller: ["$scope", "$http", controller],
            link: link
        };

        function controller($scope, $http) { // example controller creating the scope bindings
            // $scope.todos = [];
            // // example of xhr call to the server's 'RESTful' api
            // $http.get("api/Todo/Todos").then(response => $scope.todos = response.data);
        }

        function link(scope, element, attrs) {
            
            // set default length show itens
            if(scope.lengthShowDefault == undefined){
                scope.itensShowPage = "20";
            } else {
                scope.itensShowPage = scope.lengthShowDefault;
            }
            
            // set show data scope
            scope.setDataShow = function(allData ,start, maxShow){
               
               scope.showData = [];
               
               for(let i = start; i < maxShow; i++){
                    scope.showData.push(allData[i]);
                    
                    if(i+1 == allData.length){
                        break;
                    }
               }
               
               
            }
           
           scope.setDataShow(scope.data, 0, parseInt(scope.itensShowPage))
           
           
           
        }

        return directive;
    }

    /**
     * Directive definition function of 'pagination' directive.
     * 
     * TODO: make it a reusable component (i.e. usable by any list of objects not just the Models.Todo model)
     * TODO: correctly parametrize scope (inherited? isolated? which properties?)
     * TODO: create appropriate functions (link? controller?) and scope bindings
     * TODO: make appropriate general directive configuration (support transclusion? replace content? EAC?)
     * 
     * @returns {} directive definition object
     */
    function pagination() {
        var directive = {
            restrict: "E", // example setup as an element only
            templateUrl: "app/templates/pagination.html",
            scope: true, // example empty isolate scope
            controller: ["$scope", controller],
            link: link
        };

        function controller($scope) {
            
        }

        function link(scope, element, attrs) {

            // computes total itens in page
            scope.totalItens = scope.data.length;
            // default page data table
            scope.currentPage = 1;

            // computes total pages
            scope.totalPages = Math.ceil(scope.data.length / scope.itensShowPage);

            // update the data shown on the table
            var updateShowData = function (page) {
                // computes start shown item
               let startItem = (page * scope.itensShowPage) - scope.itensShowPage;
                // computes end shown item
               let endItem = page * scope.itensShowPage;
               
              scope.setDataShow(scope.data, startItem, endItem);
            }

            // update data to next page
            scope.nextPage = function(){
               if(scope.currentPage < scope.totalPages){
                    scope.currentPage++;
                    updateShowData(scope.currentPage);
               }
            }

            // update data to back page
            scope.backPage = function(){
                if(scope.currentPage > 1){
                    scope.currentPage--;
                    updateShowData(scope.currentPage);
               }
            }

            // update data to last page
            scope.lastPage = function(){
                scope.currentPage = scope.totalPages;
                updateShowData(scope.currentPage);
            }

            // update data to first page
            scope.firstPage = function(){
                scope.currentPage = 1;
                updateShowData(scope.currentPage);
            }

            // update the data length shown in table

            scope.updateShowItensPage = function(){
                scope.totalPages = Math.ceil(scope.data.length / scope.itensShowPage);
                updateShowData(1);
            }
        }

        return directive;
    }

})(angular);
