using System.Collections.Generic;
using System.Web.Http;
using InterviewTestPagination.Models;
using InterviewTestPagination.Models.Todo;
using InterviewTestPagination.Models.DTO;

namespace InterviewTestPagination.Models {
    /// <summary>
    /// 'Rest' controller for the <see cref="Todo"/>
    /// model.
    /// 
    /// TODO: implement the pagination Action
    /// </summary>
    public class TodoController : ApiController {

        // TODO: [low priority] setup DI 
        private readonly IModelService<Todo.Todo> _todoService = new TodoService();

        // TODO: [discussion] return DTO models to front-end instead of Domain Models - to no explicit the domain model, but keep a consitent contract between API and front-end. In this architecture front-end and server-side are on the same project, separate them into two different projects would justify the creation of more DTOs.
        [HttpGet]
        public TodoPaginated Todos(int? page = 1, int pageSize = 20, string orderBy = "", bool ascending = true) {

            if (string.IsNullOrWhiteSpace(orderBy))
            {
                orderBy = "CreatedDate";
                ascending = false;
            }
         
            return _todoService.ListPaginated(page.Value, pageSize, orderBy, ascending);
        }

    }
}
