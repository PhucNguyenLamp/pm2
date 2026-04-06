import { Typography, Box, Paper, Skeleton, Tabs, Tab } from "@mui/material";
import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Statistics() {
  const [temperature, setTemperature] = useState();
  const [humidity, setHumidity] = useState();
  const [lightIntensity, setLightIntensity] = useState();
  const [distanceSensor, setDistanceSensor] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("1h");
  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/statistics");
      const data = res.data;
      setTemperature(data.temperature_value_time);
      setHumidity(data.humidity_value_time);
      setLightIntensity(data.light_value_time);
      setDistanceSensor(data.distance_value_time);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const timeLengthFilter = (len) => {
    const now = new Date();
    const cutoff = new Date();

    if (len === "1h") {
      cutoff.setHours(now.getHours() - 1);
    } else if (len === "3h") {
      cutoff.setHours(now.getHours() - 3);
    } else if (len === "24h") {
      cutoff.setDate(now.getDate() - 1);
    } else if (len === "7d") {
      cutoff.setDate(now.getDate() - 7);
    }

    return (time) => new Date(time) >= cutoff;
  };
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={400} />
      ) : (
        <>
          <Tabs
            value={selectedTab}
            onChange={(_e, newValue) => {
              setSelectedTab(newValue);
            }}
            className="video-list-tabs"
          >
            <Tab value="1h" label="1h" />
            <Tab value="3h" label="3h" />
            <Tab value="24h" label="24h" />
            <Tab value="7d" label="7d" />
          </Tabs>
          <Paper
            sx={{
              padding: 2,
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignContent: "center",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h5">Temperature (°C)</Typography>
              <LineChart
                xAxis={[
                  {
                    data: temperature.time
                      .filter((t, index) => index % 5 === 0)
                      .filter(timeLengthFilter(selectedTab))
                      .map(
                        (t) =>
                          new Date(t).getHours() +
                          new Date(t).getMinutes() / 60 +
                          new Date(t).getSeconds() / 3600
                      ),
                  },
                ]}
                series={[
                  {
                    data: temperature.temperature.filter(
                      (_, index) => index % 5 === 0
                    ),
                    area: true,
                  },
                ]}
                width={500}
                height={300}
                colors={["#7a301f"]}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h5">Humidity (%)</Typography>
              <LineChart
                xAxis={[
                  {
                    data: humidity.time.map(
                      (t) =>
                        new Date(t).getHours() +
                        new Date(t).getMinutes() / 60 +
                        new Date(t).getSeconds() / 3600
                    ),
                  },
                ]}
                series={[
                  {
                    data: humidity.humidity,
                    area: true,
                  },
                ]}
                width={500}
                height={300}
                colors={["#05192C"]}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h5">Light Intensity (Lux)</Typography>
              <LineChart
                xAxis={[
                  {
                    data: lightIntensity.time.map(
                      (t) =>
                        new Date(t).getHours() +
                        new Date(t).getMinutes() / 60 +
                        new Date(t).getSeconds() / 3600
                    ),
                  },
                ]}
                series={[
                  {
                    data: lightIntensity.light,
                    area: true,
                  },
                ]}
                width={500}
                height={300}
                colors={["#CFB53B"]}
              />
            </Box>
          </Paper>
        </>
      )}
    </>
  );
}
