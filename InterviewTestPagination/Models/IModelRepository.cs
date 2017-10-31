using InterviewTestPagination.Models.DTO;
using System.Collections.Generic;

namespace InterviewTestPagination.Models {

    /// <summary>
    /// Datasource/Driver layer's main entry-point.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IModelRepository<T> {
        /// <summary>
        /// Example of method signature: lists all entries of type T
        /// </summary>
        /// <returns></returns>
        IEnumerable<T> All();

        /// <summary>
        /// Return result already formated in pages.
        /// </summary>
        /// <param name="page">Current Page</param>
        /// <param name="pageSize">Number of elements in a page</param>
        /// <param name="orderBy">Property to order the elements</param>
        /// <param name="ascending">Value true for ascending, or false to descending</param>
        /// <returns></returns>
        TodoPaginated AllPaged(int page, int pageSize, string orderBy, bool ascending);
    }
}
