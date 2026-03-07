"use client";
import React from "react";

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey: (row: T) => string;
}

function Table<T>({ columns, data, loading, emptyMessage = "No data found", rowKey }: TableProps<T>) {
  if (loading) {
    return (
      <div className="ui-table__loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className || ""}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td key={col.key} className={col.className || ""}>
                    {col.render
                      ? col.render(row, index)
                      : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
