using System.Web.Http;
using InterviewTestPagination.Models;
using InterviewTestPagination.Models.Todo;

namespace InterviewTestPagination.Controllers {
    /// <summary>
    /// 'Rest' controller for the <see cref="Todo"/> model.
    /// Só recebe a requisição HTTP e repassa para o service.
    /// </summary>
    /// <remarks>
    /// Bug corrigido: a rota por convenção "api/{controller}/{id}" interpretava
    /// "Todos" em "api/Todo/Todos" como o parâmetro {id}. Funcionava por coincidência
    /// (única ação GET). Com attribute routing a rota fica explícita.
    /// </remarks>
    [RoutePrefix("api/Todo")]
    public class TodoController : ApiController {

        // TODO: [low priority] setup DI
        private readonly IModelService<Todo> _todoService = new TodoService();

        /// <summary>
        /// GET api/Todo/Todos?page=1&amp;pageSize=20&amp;sortBy=createdDate&amp;sortDir=desc
        /// pageSize = 0 returns all items.
        /// </summary>
        [HttpGet]
        [Route("Todos")]
        public PagedResult<Todo> Todos(int page = 1, int pageSize = 20,
                                       string sortBy = "createdDate", string sortDir = "desc") {
            return _todoService.List(page, pageSize, sortBy, sortDir);
        }
    }
}