export default function Table({
  columns,
  data,
  loading,
  emptyMsg = "No records found.",
}) {
  if (loading) {
    return (
      <div className="spinner-center">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key || column.label}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {!data?.length ? (
            <tr>
              <td
                colSpan={columns.length}
                className="table-empty"
              >
                {emptyMsg}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row._id || index}>
                {columns.map((column) => (
                  <td
                    key={column.key || column.label}
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
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