import * as React from "react";
import ReactPaginate from "react-paginate";
import "./style.scss";

export interface IPaginationProps {
  itemsPerPage?: number;
  items: Array<number>;
  setCurrentItems: (items: number[]) => void;
}
export const Pagination: React.FC<IPaginationProps> = function ({
  itemsPerPage = 10,
  items,
  setCurrentItems,
}) {
  const handlePageClick = (selectedItem: { selected: number }) => {
    const newOffset = (selectedItem.selected * itemsPerPage) % items.length;
    setCurrentItems(items.slice(newOffset, newOffset + itemsPerPage));
  };

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">>"
      onPageChange={handlePageClick}
      pageRangeDisplayed={itemsPerPage}
      pageCount={Math.ceil(items.length / itemsPerPage)}
      previousLabel="<<"
      renderOnZeroPageCount={null}
      className="pagination"
      containerClassName="pagination-container"
      pageClassName="pagination-page"
      previousClassName="pagination-prev"
      nextClassName="pagination-next"
    />
  );
};
