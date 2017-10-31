using InterviewTestPagination.Models.DTO;
using System.Collections.Generic;

namespace InterviewTestPagination.Models.Todo {
    /// <summary>
    /// </summary>
    public class TodoService : IModelService<Todo> {

        private IModelRepository<Todo> _repository;

        // TODO: [low priority] setup DI 
        public TodoService()
        {
            _repository = new TodoRepository();
        }

        //No need to externalize Repository access.
        //Considering this the Model Service layer's main entry-point - only the service can manipulate the repository
        //public IModelRepository<Todo> Repository {
        //    get { return _repository; }
        //    set { _repository = value; }
        //}

        public TodoPaginated ListPaginated(int page, int pageSize, string orderBy, bool ascending)
        {
            return 
                _repository.AllPaged(page, pageSize, orderBy, ascending);
        }

    }
}
