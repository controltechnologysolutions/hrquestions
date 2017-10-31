using InterviewTestPagination.Models.DTO;
using System.Collections.Generic;

namespace InterviewTestPagination.Models {
    /// <summary>
    /// Model Service layer's main entry-point. 
    /// Should translate high-level commands and data structures into something that can be used by the data source layer.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IModelService<T> {

        //Removed direct access and dependence to the Repository Layer. 
        //Service implementation sets the repository. Keeping only high-level commands.
        //IModelRepository<T> Repository { get; set; }

        /// <summary>
        /// Return result already formated in pages.
        /// </summary>
        /// <param name="page">Current Page</param>
        /// <param name="pageSize">Number of elements in a page</param>
        /// <param name="orderBy">Property to order the elements</param>
        /// <param name="ascending">Value true for ascending, or false to descending</param>
        /// <returns></returns>
        TodoPaginated ListPaginated(int page, int pageSize, string orderBy, bool ascending);
    }
}
