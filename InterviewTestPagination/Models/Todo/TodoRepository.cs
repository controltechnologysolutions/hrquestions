using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace InterviewTestPagination.Models.Todo {

    /// <summary>
    /// No need to use an actual persistent datasource.
    /// All operations can be mocked in-memory as long as they are consistent with the chosen datasource implementation
    /// (e.g. dont create new model instances when executing a search 'query', etc).
    /// TL;DR: from this point on Database-like operations can be mocked.
    /// </summary>
    public class TodoRepository : IModelRepository<Todo> {

        /// <summary>
        /// Example in-memory model datasource 'indexed' by id.
        /// </summary>
        private static readonly IDictionary<long, Todo> DataSource = new ConcurrentDictionary<long, Todo>();

        static TodoRepository() {
            // initializing datasource
            var startDate = DateTime.Today;
            for (var i = 1; i <= 55; i++) {
                var createdDate = startDate.AddDays(i);
                DataSource[i] = new Todo(id: i, task: "Dont forget to do " + i, createdDate: createdDate);
            }
        }

        public IEnumerable<Todo> All() {
            return DataSource.Values.OrderByDescending(t => t.CreatedDate);
        }

        public int Count() {
            return DataSource.Count;
        }

        public IEnumerable<Todo> Query(int skip, int take, string sortBy, bool descending) {
            // 1. ordena a lista INTEIRA (assim a ordem vale entre as páginas)
            IEnumerable<Todo> query = Sort(DataSource.Values, sortBy, descending);

            // 2. recorta só o pedaço pedido
            query = query.Skip(skip);
            if (take > 0) query = query.Take(take);

            // devolve as MESMAS instâncias do datasource (não cria objetos novos)
            return query.ToList();
        }

        /// <summary>
        /// Lista branca de campos ordenáveis.
        /// Desempate por Id para a ordem ser sempre estável entre páginas.
        /// </summary>
        private static IEnumerable<Todo> Sort(IEnumerable<Todo> source, string sortBy, bool descending) {
            switch ((sortBy ?? "").ToLowerInvariant()) {
                case "id":
                    return descending ? source.OrderByDescending(t => t.Id) : source.OrderBy(t => t.Id);

                case "task":
                    return descending
                        ? source.OrderByDescending(t => t.Task, StringComparer.OrdinalIgnoreCase).ThenByDescending(t => t.Id)
                        : source.OrderBy(t => t.Task, StringComparer.OrdinalIgnoreCase).ThenBy(t => t.Id);

                case "createddate":
                default: // padrão: data de criação
                    return descending
                        ? source.OrderByDescending(t => t.CreatedDate).ThenByDescending(t => t.Id)
                        : source.OrderBy(t => t.CreatedDate).ThenBy(t => t.Id);
            }
        }
    }
}