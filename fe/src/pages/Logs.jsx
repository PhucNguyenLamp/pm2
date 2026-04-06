import { useEffect, useState } from "react";
import { Paper, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const types = {
  fan_device: "Fan",
  light_device_led: "Light LED",
  light_device_status: "Light Status",
  huminity_device_status: "Humidity Sensor",
  temperature_device_status: "Temperature Sensor",
};

const columns = [
  {
    field: "timestamp",
    headerName: "Time",
    width: 200,
    type: "dateTime",
  },
  { field: "device", headerName: "Device", width: 200 },
  { field: "message", headerName: "Message", width: 300 },
];

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const getLogs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/logs");
      console.log(response.data);
          // Humidity: 52.2,
          //     Temperature: 25.7,
          //         timestamp: 2025-03 - 28T03: 40:07.835Z,
      
          //    intensity: 64,
          // timestamp: 2025-03 - 28T03: 38: 56.595Z,
      
          // {
          //     _id: 'f4afc949-b6ab-4681-a636-531de340c316',
          //         fanSpeed: 89,
          //             timestamp: 2025-03 - 19T08: 54:00.758Z,
          //                 _class: 'com.example.iot_project.entity.Log'
          // },
          // {
          //     _id: 'e95666f6-d26a-43ca-94ab-8e9cf3709ca4',
          //         LEDStatus: 'ON',
          //             LEDColor: '#612304',
          //                 timestamp: 2025-03 - 19T08: 54:01.086Z,
          //                     _class: 'com.example.iot_project.entity.Log'
          // },
      
      const logs = response.data.map((log) => ({
        id: log._id,
        timestamp: new Date(log.timestamp),
        device:
          log.fanSpeed !== undefined
        ? types.fan_device
        : log.LEDStatus !== undefined
        ? types.light_device_led
        : log.intensity !== undefined
        ? types.light_device_status
        : types.temperature_device_status + " & " + types.huminity_device_status,
        message:
          log.fanSpeed !== undefined
        ? `Fan Speed: ${log.fanSpeed}%`
        : log.LEDStatus !== undefined
        ? `LED Status: ${log.LEDStatus}, LED Color: ${log.LEDColor ?? "Unknown"}`
        : log.intensity !== undefined
        ? `Light Intensity: ${log.intensity}`
        : `Temperature: ${log.Temperature}°C, Humidity: ${log.Humidity}%`,
      }));
      setLogs(logs);

    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLogs();
    let interval = setInterval(() => {
      getLogs();
    }
    , 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper sx={{ padding: 2 }}>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={400} />
      ) : (
        <DataGrid
          rows={logs}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
            sorting: { sortModel: [{ field: "timestamp", sort: "desc" }] },
          }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      )}
    </Paper>
  );
}
