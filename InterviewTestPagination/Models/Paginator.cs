using System;
using System.Collections.Generic;
using System.Linq;

namespace InterviewTestPagination.Models
{
    public class Paginator<T>
    {
        public IEnumerable<T> Items;

        /// <summary>
        /// The amount of Items shown on each page.
        /// </summary>
        public int ItemsPerPage;

        /// <summary>
        /// The current selected page.
        /// </summary>
        public int CurrentPage = 1;

        public int TotalItens => Items?.Count() ?? 0;

        public int TotalPages => (int)Math.Ceiling(TotalItens / (decimal)ItemsPerPage);


        /// <summary>
        /// Gets all the items according with the <see cref="CurrentPage"/>
        /// </summary>
        /// <returns>All the items that are on the page <see cref="CurrentPage"/></returns>
        public IEnumerable<T> GetItemsOnCurrentPage()
        {
            return GetItemsOnPage(CurrentPage);
        }

        /// <summary>
        /// Gets all items on page <paramref name="page"/>
        /// </summary>
        /// <param name="page"></param>
        /// <returns></returns>
        public IEnumerable<T> GetItemsOnPage(int page)
        {
            return Items.Skip((page - 1) * ItemsPerPage).Take(ItemsPerPage);
        }

        /// <summary>
        /// Initializes a new instance of the paginator.
        /// </summary>
        /// <param name="items"></param>
        /// <param name="itemsPerPage">How many items should we shown on each page?</param>
        public Paginator(IEnumerable<T> items, int itemsPerPage)
        {
            Items = items;
            ItemsPerPage = itemsPerPage;
        }
    }
}