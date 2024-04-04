import React, { useEffect, useState } from 'react';
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import xmlJs from 'xml-js';

const CORS_PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const API_URL = 'https://data.tmd.go.th/api/DailyForecast/v2/?uid=api&ukey=api12345';

const parseXmlToJson = (xmlData) => {
    const options = { compact: true, spaces: 4 };
    const jsonData = xmlJs.xml2json(xmlData, options);
    return JSON.parse(jsonData);
};

const Daily_Forecast = () => {
    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${CORS_PROXY_URL}${API_URL}`);
                const xmlData = await response.text();
                const jsonData = parseXmlToJson(xmlData);
                const forecasts = jsonData.WeatherForecastDaily.DailyForecast.RegionForecast;
                setForecastData(forecasts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching forecast data:', error);
                setLoading(true);
            }
        };
        fetchData();
    }, []);

    return (
        <DashboardCard title="Daily Forecast">
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                    <Table
                        aria-label="simple table"
                        sx={{
                            whiteSpace: "nowrap",
                            mt: 2
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Region Name
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Description
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {forecastData.map((forecast, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                            {forecast.RegionNameEnglish._text}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                            {forecast.DescriptionEnglish._text}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}
        </DashboardCard>
    );
};

export default Daily_Forecast;
