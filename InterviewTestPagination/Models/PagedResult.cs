using System.Collections.Generic;
using Newtonsoft.Json;

namespace InterviewTestPagination.Models {
    /// <summary>
    /// Generic page of results. Reusable for any model, not only Todo.
    /// </summary>
    public class PagedResult<T> {

        [JsonProperty("items")]
        public IEnumerable<T> Items { get; set; }

        [JsonProperty("page")]
        public int Page { get; set; }

        /// <summary>0 means "all items" (no pagination).</summary>
        [JsonProperty("pageSize")]
        public int PageSize { get; set; }

        [JsonProperty("totalItems")]
        public int TotalItems { get; set; }

        [JsonProperty("totalPages")]
        public int TotalPages { get; set; }
    }
}