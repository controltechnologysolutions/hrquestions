(function(angular) {
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
            $scope.$on("itemsChanged",
                function(event, args) {
                    $scope.todos = args;
                });

            //I think this could be improved, loading only the items corresponding from the page, not all at once, but lets keep this simple for now :)
            $http.get("api/Todo/Todos").then(response => {
                    $scope.todos = response.data;
                    //we call an event to tell our pagination controller that all items has been loaded.
                    $scope.$broadcast("itemsLoaded", $scope.todos);
                }
            );


        }

        function link(scope, element, attrs) {}

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
            scope: {}, // example empty isolate scope
            controller: ["$scope", controller],
            link: link
        };
        
         /*
          * The pagination system works with events.
          * When the items has been loaded, we should call the 'itemsLoaded' event to initialize the pagination system.
          * When the items changes we call the itemsChanged event, to change the list.
          * The bad thing about this approach is that it will probably not work properly if we have more than one pagination in the same page.
          */
        function controller($scope) {
            $scope.$on("itemsLoaded",
                function(event, args) {
                    $scope.items = args;
                    $scope.changePage(1);
                });

            $scope.changePage = function(newPage) {
                var itemsLen = $scope.items.length;
                var itemsPerPage = parseInt($scope.itemsPerPage);
                if (isNaN($scope.itemsPerPage)) //we check if its not a number
                    itemsPerPage = itemsLen;


                var totalPages = Math.ceil(itemsLen / itemsPerPage);
                newPage = Math.max(1, Math.min(newPage, totalPages)); //clamp between 1 & totalPages

                var startIdx = (newPage - 1) * itemsPerPage; //the index we should start picking the items
                var items = $scope.items.slice(startIdx, startIdx + itemsPerPage); 
                $scope.currentPage = newPage;
                $scope.lastPage = totalPages;

                //we call an event telling that our list has changed
                $scope.$emit("itemsChanged", items);
            }
        }

        function link(scope, element, attrs) {
            //we set the default items per page
            scope.itemsPerPage = "20";
        }

        return directive;
    }

})(angular);