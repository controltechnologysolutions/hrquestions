using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterviewTestPagination.Models.DTO
{
    public abstract class Paginated<T>
    {
        // <summary>
        /// The current page number this page represents.
        /// </summary>
        public int Currentpage { get; set; }

        /// <summary>
        /// The page size.
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// Total pages available.
        /// </summary>
        public int TotalNumberOfPages { get; set; }

        /// <summary>
        /// Total records available.
        /// </summary>
        public int TotalNumberOfRecords { get; set; }

        /// <summary>
        /// List of results to exhibit.
        /// </summary>
        public IEnumerable<T> Results { get; set; }
    }
}
