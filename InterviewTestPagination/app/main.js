(function (angular) {
    "use strict";

    angular
        .module("todoApp")
        .directive("todoPaginatedList", [todoPaginatedList])
        .directive("pagination", [pagination]);

    /**
     * Directive definition function of 'todoPaginatedList'.
     * 
     * @returns {} directive definition object
     */
    function todoPaginatedList() {
        var directive = {
            restrict: "E", // example setup as an element only
            templateUrl: "app/templates/todo.list.paginated.html",
            scope: { paginated: '=pageData'}, // example empty isolate scope
            controller: ["$scope", "$http", controller],
            link: link
        };

        function controller($scope, $http) { // example controller creating the scope bindings

            $scope.pageData = {};
            $http.get("api/Todo/Todos").then(response => $scope.pageData = response.data);

            $scope.orderByField = "CreatedDate";
            $scope.ascendingSort = false;

            //TODO: [discussion] fucntion loadPage() on $scope over the pagination directive to keep paginantion flexible to any model.
            $scope.loadPage = function (page, pageSize, orderBy, ascending) {
                $http.get("api/Todo/Todos" + "?page=" + page + "&pageSize=" + pageSize + "&orderBy=" + orderBy + "&ascending=" + ascending).then(response => $scope.pageData = response.data);
            };
            
        }

        function link(scope, element, attrs) { }

        return directive;
    }

    /**
     * Directive definition function of 'pagination' directive.
     * 
     * @returns {} directive definition object
     */
    function pagination() {
        var directive = {
            restrict: "E", // example setup as an element only
            templateUrl: "app/templates/pagination.html",
            scope: {
                paginated: '=pageData',
                loadPage: '=loadPage',
                orderByField: '=orderByField',
                ascendingSort: '=ascendingSort'
            }, 
            controller: ["$scope", controller],
            link: link
        };

        function controller($scope) {
            
        }

        function link($scope, element, attrs) {

            if (!$scope.currentPage || $scope.currentPage <= 0) {
                $scope.currentPage = 1;
            }

            if (!$scope.selectedPageSize) {
                $scope.selectedPageSize = "20";
            }

            $scope.goToPage = function (pageNo) {

                if ($scope.selectedPageSize == "all")
                    $scope.selectedPageSize = $scope.paginated.totalNumberOfRecords;

                $scope.loadPage(pageNo, $scope.selectedPageSize, $scope.orderByField, $scope.ascendingSort);

                //TODO: DRY code - prevent duplicated calls;
                if ($scope.currentPage != pageNo)
                    $scope.currentPage = pageNo;
            }

            $scope.goToNextPage = function () {

                var nextPage = $scope.currentPage + 1;
                if (nextPage > $scope.paginated.totalNumberOfPages)
                    nextPage = $scope.paginated.totalNumberOfPages;

                $scope.currentPage = nextPage;
            }

            $scope.goToPreviousPage = function () {

                var previousPage = $scope.currentPage - 1;
                if (previousPage < 0)
                    previousPage = 1;

                $scope.currentPage = previousPage;
            }

            $scope.$watch("currentPage", function (newValue, oldValue) {
                //TODO: DRY code - prevent duplicated calls;
                if (newValue != oldValue)
                    $scope.goToPage(newValue);
            });

            $scope.$watch("selectedPageSize", function (newValue, oldValue) {
                //TODO: DRY code - prevent duplicated calls;
                if (newValue != oldValue)
                    $scope.goToPage($scope.currentPage);
            });

            $scope.$watch("ascendingSort", function (newValue, oldValue) {
                //TODO: DRY code - prevent duplicated calls;
                if (newValue != oldValue)
                    $scope.goToPage($scope.currentPage);
            });
        }

        return directive;
    }

})(angular);

