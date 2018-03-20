using System.Collections.Generic;

namespace InterviewTestPagination.Models.Todo
{
    /// <summary>
    /// TODO: Implement methods that enable pagination
    /// </summary>
    public class TodoService : IModelService<Todo>
    {
        public IModelRepository<Todo> Repository { get; set; } = new TodoRepository();

        /// <inheritdoc />
        /// <summary>
        /// Example implementation of List method: lists all entries of type <see cref="T:InterviewTestPagination.Models.Todo.Todo" />
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Todo> List( /* parameters */)
        {
            // invoke Datasource layer
            return Repository.All();
        }

    }
}