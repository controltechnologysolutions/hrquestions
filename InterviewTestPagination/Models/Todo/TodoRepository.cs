using InterviewTestPagination.Models.DTO;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace InterviewTestPagination.Models.Todo {

    /// <summary>
    /// No need to use an actual persistent datasource. 
    /// All operations can be mocked in-memory as long as they are consistent with the chosen datasource implementation 
    /// (e.g. dont create new model instances when executing a search 'query', etc).
    /// TL;DR: from this point on Database-like operations can be mocked.
    /// </summary>
    public class TodoRepository : IModelRepository<Todo>
    {

        /// <summary>
        /// Example in-memory model datasource 'indexed' by id.
        /// </summary>
        private static readonly IDictionary<long, Todo> DataSource = new ConcurrentDictionary<long, Todo>();

        static TodoRepository() {
            // initializing datasource
            var startDate = DateTime.Today;
            for (var i = 1; i <= 55; i++) {
                var createdDate = startDate.AddDays(i);
                DataSource[i] = new Todo(id: i, task: "Dont forget to do " + i, createdDate: createdDate);
            }
        }

        public IEnumerable<Todo> All() {
            return DataSource.Values.OrderByDescending(t => t.CreatedDate);
        }

        public TodoPaginated AllPaged(int page, int pageSize, string orderBy, bool ascending)
        {
            var skipAmount = pageSize * (page - 1);

            var projection = DataSource.Values
                .Skip(skipAmount)
                .Take(pageSize);

            var propertyInfo = typeof(Todo).GetProperty(orderBy);
            if (ascending)
            {
                projection = projection.OrderBy(x => propertyInfo.GetValue(x, null));
            }
            else
            {
                projection = projection.OrderByDescending(x => propertyInfo.GetValue(x, null));
            }

            var totalNumberOfRecords = DataSource.Values.Count;
            var results = projection.ToList();

            var mod = totalNumberOfRecords % pageSize;
            var totalPageCount = (totalNumberOfRecords / pageSize) + (mod == 0 ? 0 : 1);


            return new TodoPaginated
            {
                Results = results,
                Currentpage = page,
                PageSize = pageSize,
                TotalNumberOfPages = totalPageCount,
                TotalNumberOfRecords = totalNumberOfRecords
            };
        }
    }
}
