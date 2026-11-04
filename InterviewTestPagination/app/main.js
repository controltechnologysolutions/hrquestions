(function (angular) {
    "use strict";

    angular
        .module("todoApp")
        .directive("todoPaginatedList", [todoPaginatedList])
        .directive("pagination", [pagination]);

    /**
     * Lista de Todos paginada e ordenável.
     * Guarda o estado (página, tamanho, ordenação, totais) e busca os dados
     * no servidor sempre que algo muda.
     */
    function todoPaginatedList() {
        var directive = {
            restrict: "E",
            templateUrl: "app/templates/todo.list.paginated.html",
            scope: {}, // isolado: a lista não depende de nada de fora
            controller: ["$scope", "$http", controller]
        };

        function controller($scope, $http) {
            $scope.todos = [];
            $scope.loading = false;

            $scope.paging = {
                page: 1,
                pageSize: 20,   // padrão pedido no teste
                totalItems: 0,
                totalPages: 1
            };

            // Primeiro carregamento: createdDate desc, mas SEM indicador visível
            // (o indicador só aparece depois que o usuário clica em um cabeçalho)
            $scope.sort = { by: "createdDate", dir: "desc", userSelected: false };

            $scope.load = function () {
                $scope.loading = true;

                $http.get("api/Todo/Todos", {
                    params: {
                        page: $scope.paging.page,
                        pageSize: $scope.paging.pageSize,
                        sortBy: $scope.sort.by,
                        sortDir: $scope.sort.dir
                    }
                }).then(function (response) {
                    var data = response.data;
                    $scope.todos = data.items;
                    $scope.paging.page = data.page;
                    $scope.paging.totalItems = data.totalItems;
                    $scope.paging.totalPages = data.totalPages;
                }).finally(function () {
                    $scope.loading = false;
                });
            };

            /**
             * Clique no cabeçalho:
             * - mesma coluna já selecionada pelo usuário -> inverte a ordem
             * - outra coluna (ou primeiro clique)       -> ordena ascendente
             * - sempre volta para a página 1, mantendo o tamanho da página
             */
            $scope.sortBy = function (property) {
                if ($scope.sort.userSelected && $scope.sort.by === property) {
                    $scope.sort.dir = $scope.sort.dir === "asc" ? "desc" : "asc";
                } else {
                    $scope.sort.by = property;
                    $scope.sort.dir = "asc";
                    $scope.sort.userSelected = true;
                }

                $scope.paging.page = 1;
                $scope.load();
            };

            // Indicador ao lado do título: só na coluna ativa e só após um clique
            $scope.sortIndicator = function (property) {
                if (!$scope.sort.userSelected || $scope.sort.by !== property) return "";
                return $scope.sort.dir === "asc" ? "\u25B2" : "\u25BC"; // ▲ / ▼
            };

            $scope.load();
        }

        return directive;
    }

    /**
     * Componente de paginação REUTILIZÁVEL.
     * Não sabe nada sobre Todo: só recebe números e avisa quando algo muda.
     *
     * Uso:
     *   <pagination page="x.page" page-size="x.pageSize"
     *               total-items="x.totalItems" total-pages="x.totalPages"
     *               on-change="carregar()"></pagination>
     *
     * Obs.: bindings "=" porque o AngularJS 1.4.8 não suporta one-way ("<").
     */
    function pagination() {
        var directive = {
            restrict: "E",
            templateUrl: "app/templates/pagination.html",
            scope: {
                page: "=",        // página atual
                pageSize: "=",    // itens por página; 0 = todos
                totalItems: "=",  // total de itens (o componente só lê)
                totalPages: "=",  // total de páginas (o componente só lê)
                onChange: "&"     // callback chamado quando página/tamanho mudam
            },
            controller: ["$scope", "$timeout", controller]
        };

        function controller($scope, $timeout) {
            $scope.sizeOptions = [
                { value: 10, label: "10" },
                { value: 20, label: "20" },
                { value: 30, label: "30" },
                { value: 0,  label: "Todos" }
            ];

            // valor digitado no input (separado para não disparar busca a cada tecla)
            $scope.inputPage = $scope.page;
            $scope.$watch("page", function (p) { $scope.inputPage = p; });

            function notify() {
                // $timeout garante que o two-way binding já atualizou o pai
                $timeout(function () { $scope.onChange(); });
            }

            $scope.goTo = function (p) {
                p = parseInt(p, 10);
                if (isNaN(p)) { $scope.inputPage = $scope.page; return; }

                p = Math.max(1, Math.min(p, $scope.totalPages || 1));
                $scope.inputPage = p;
                if (p === $scope.page) return;

                $scope.page = p;
                notify();
            };

            $scope.first = function () { $scope.goTo(1); };
            $scope.prev  = function () { $scope.goTo($scope.page - 1); };
            $scope.next  = function () { $scope.goTo($scope.page + 1); };
            $scope.last  = function () { $scope.goTo($scope.totalPages); };

            $scope.isFirst = function () { return $scope.page <= 1; };
            $scope.isLast  = function () { return $scope.page >= $scope.totalPages; };

            $scope.changeSize = function () {
                $scope.page = 1; // ao trocar o tamanho, volta para a primeira página
                notify();
            };
        }

        return directive;
    }

})(angular);