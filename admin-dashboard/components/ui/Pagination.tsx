import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  total?: number;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange, showInfo = true, total }) => {
  if (totalPages <= 1) return null;

  const maxVisible = 5;
  const start = Math.max(1, Math.min(page - Math.floor(maxVisible / 2), totalPages - maxVisible + 1));
  const pages = Array.from({ length: Math.min(totalPages, maxVisible) }, (_, i) => start + i);

  return (
    <div className="table-footer">
      {showInfo && (
        <div className="showing-info">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          {total !== undefined && <> &middot; {total} total</>}
        </div>
      )}
      <div className="pagination">
        <button className="page-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <i className="fi fi-rr-angle-left" />
        </button>
        {pages.map((num) => (
          <button
            key={num}
            className={`page-btn ${num === page ? "active" : ""}`}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}
        <button className="page-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          <i className="fi fi-rr-angle-right" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
