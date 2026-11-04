using System.Collections.Generic;

namespace InterviewTestPagination.Models
{
    /// <summary>
    /// Model Service layer's main entry-point.
    /// Translates high-level commands (page, page size) into something the data source layer understands (skip, take).
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IModelService<T>
    {

        /// <summary>
        /// Reference to Repository layer
        /// </summary>
        IModelRepository<T> Repository { get; set; }

        /// <summary>
        /// Lists all entries of model T
        /// </summary>
        IEnumerable<T> List();

        /// <summary>
        /// Lists one page of entries of model T.
        /// </summary>
        /// <param name="page">1-based page number (clamped to the valid range)</param>
        /// <param name="pageSize">items per page; 0 = all items</param>
        /// <param name="sortBy">property name to sort by</param>
        /// <param name="sortDir">"asc" or "desc"</param>
        PagedResult<T> List(int page, int pageSize, string sortBy, string sortDir);
    }
}