(function (angular) {
    "use strict";

    angular
        .module("todoApp")
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
     */
    function todoPaginatedList() {
        var directive = {
            restrict: "E", // example setup as an element only
            templateUrl: "app/templates/todo.list.paginated.html",
            scope: {}, // example empty isolate scope
            controller: ["$scope", "$http", controller],
            link: link
        };

        function controller($scope, $http) { // example controller creating the scope bindings
            $scope.todos = [];
            // example of xhr call to the server's 'RESTful' api
            // for enterprise it will be better to get only meta data totalItem.count insteads of whole records table
            $http.get("api/Todo/Todos").then(response => $scope.todos = response.data);


            // api service call to return only the request items
            $scope.goLoadPage = function(pNo, pSize) {
                // service to call search api to return the only currentpage data
                //$http.get("api/Todo/Search?entity=todo&pNo" + pNo + "&pSize=" & pSize).then(response => $scope.todos = response.data);
                alert('goLoadPage');
            };
        }

        function link(scope, element, attrs) { }

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
            scope: {
                todos: "=" // the array of todo list
            }, // example empty isolate scope
            controller: ["$scope", controller],
            link: function (scope, element, attrs) {

                if (!scope.curPage) {
                    scope.curPage = 1;                    
                }

                if (!scope.pSize) {
                    scope.pSize = 20;
                    // dropdownlist need to select option 20

                }

                if (!scope.totalPage) {
                    scope.totalPage = scope.todos.length - (scope.todos.length % scope.pSize);
                }

                scope.first = function () {
                    //alert('first');
                    $scope.goLoadPage(1, scope.pSize);
                }

                scope.goto = function (pageNo) {
                    //alert('go to page# ' +  pageNo);
                    $scope.goLoadPage(pageNo, scope.pSize);
                }

                scope.last = function () {
                    //alert('last');
                    $scope.goLoadPage(scope.totalPage, scope.pSize);
                }

                scope.updateSize = function() {
                    if (scope.pSize == 'all')
                        scope.pSize = scope.todos.length;
                    //alert('updatesize=' + scope.pSize);
                }

            }
        };

        function controller($scope) {
        }

        function link(scope, element, attrs) { }

        return directive;
    }

})(angular);

