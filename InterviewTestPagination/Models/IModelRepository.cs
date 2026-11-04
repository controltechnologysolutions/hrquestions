using System.Collections.Generic;

namespace InterviewTestPagination.Models
{

    /// <summary>
    /// Datasource/Driver layer's main entry-point.
    /// Só sabe ACESSAR dados: contar, ordenar e recortar. Não conhece "página".
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IModelRepository<T>
    {
        /// <summary>
        /// Lists all entries of type T
        /// </summary>
        IEnumerable<T> All();

        /// <summary>
        /// Total number of entries of type T
        /// </summary>
        int Count();

        /// <summary>
        /// Returns a sorted slice of the entries (like "ORDER BY ... OFFSET skip FETCH take" in SQL).
        /// take = 0 returns everything after skip.
        /// </summary>
        IEnumerable<T> Query(int skip, int take, string sortBy, bool descending);
    }
}