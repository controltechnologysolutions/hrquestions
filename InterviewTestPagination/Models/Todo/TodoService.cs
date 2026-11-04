using System;
using System.Collections.Generic;

namespace InterviewTestPagination.Models.Todo {
    /// <summary>
    /// Regras de negócio da paginação: transforma "página X com Y itens"
    /// em "pule N e pegue Y" para o repositório.
    /// </summary>
    public class TodoService : IModelService<Todo> {

        private IModelRepository<Todo> _repository = new TodoRepository();

        public IModelRepository<Todo> Repository {
            get { return _repository; }
            set { _repository = value; }
        }

        /// <summary>
        /// Lists all entries of type <see cref="Todo"/>
        /// </summary>
        public IEnumerable<Todo> List() {
            return Repository.All();
        }

        public PagedResult<Todo> List(int page, int pageSize, string sortBy, string sortDir) {
            if (pageSize < 0) pageSize = 0;

            int totalItems = Repository.Count();

            // pageSize 0 = "todos": tudo cabe em uma página só
            int totalPages = pageSize == 0
                ? 1
                : Math.Max(1, (int)Math.Ceiling(totalItems / (double)pageSize));

            // garante que a página está entre 1 e a última
            page = Math.Max(1, Math.Min(page, totalPages));

            int skip = pageSize == 0 ? 0 : (page - 1) * pageSize;
            bool descending = string.Equals(sortDir, "desc", StringComparison.OrdinalIgnoreCase);

            return new PagedResult<Todo> {
                Items = Repository.Query(skip, pageSize, sortBy, descending),
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = totalPages
            };
        }
    }
}