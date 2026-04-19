import { Chip, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useLocationHistory } from "@/hooks/useLocation";

const columns = [
  {
    field: "createdAt",
    headerName: "Time",
    width: 220,
    type: "dateTime",
    valueGetter: (value) => value ? new Date(value) : null,
  },
  {
    field: "lat",
    headerName: "Latitude",
    width: 180,
    valueFormatter: (value) => value != null ? value.toFixed(6) : "",
  },
  {
    field: "lon",
    headerName: "Longitude",
    width: 180,
    valueFormatter: (value) => value != null ? value.toFixed(6) : "",
  },
  {
    field: "insideSafezone",
    headerName: "Status",
    width: 140,
    renderCell: ({ value }) => {
      if (value === true)
        return <Chip label="Inside" color="success" size="small" />;
      if (value === false)
        return <Chip label="Outside" color="error" size="small" />;
      return <Chip label="Unknown" color="default" size="small" />;
    },
  },
  {
    field: "_id",
    headerName: "ID",
    flex: 1,
    minWidth: 200,
  },
];

export default function Logs() {
  const { data: logs, isLoading } = useLocationHistory();
  console.log(logs)
  const rows = (logs ?? []).map((log) => ({ ...log, id: log._id }));

  return (
    <Paper sx={{ padding: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
          sorting: { sortModel: [{ field: "createdAt", sort: "desc" }] },
        }}
        pageSizeOptions={[5, 10, 25]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
