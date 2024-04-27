import React, { useState, useEffect } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import * as xmlJs from 'xml-js'; // Import xml-js

const CACHE_KEY = 'monthlyRainfallData';

const SalesOverview = () => {
    const [monthlyRainfallData, setMonthlyRainfallData] = useState([]);
    const [header, setHeader] = useState([]); // State for header data
    const [province, setProvince] = useState(''); // State for selected province
    const [provinceData, setProvinceData] = useState(null); // Filtered data

    // Load initial rainfall data when the component mounts
    useEffect(() => {
        const fetchMonthlyRainfallData = async () => {
            try {
                // Check if cached data exists
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const parsedData = JSON.parse(cachedData);
                    const lastUpdated = new Date(parsedData.lastUpdated);
                    const currentTime = new Date();

                    // Check if data is older than 1 hour
                    if (currentTime - lastUpdated < 7200000) {
                        setMonthlyRainfallData(parsedData.data);
                        return;
                    }
                }

                const response = await fetch(
                    'https://cors-anywhere.herokuapp.com/https://data.tmd.go.th/api/ThailandMonthlyRainfall/v1/index.php?uid=api&ukey=api12345'
                );
                const xmlData = await response.text();

                // Convert XML to JSON using xml-js
                const jsonData = xmlJs.xml2json(xmlData, { compact: true, spaces: 4 });
                const parsedData = JSON.parse(jsonData);
                // console.log(parsedData);

                setHeader(parsedData.ThailandMonthlyRainfall.header);
                setMonthlyRainfallData(parsedData.ThailandMonthlyRainfall.StationMonthlyRainfall);

                // Cache the data for future use
                localStorage.setItem(CACHE_KEY, JSON.stringify({ data: parsedData.ThailandMonthlyRainfall.StationMonthlyRainfall, lastUpdated: new Date() }));
            } catch (error) {
                console.error('Error fetching monthly rainfall data:', error);
            }
        };

        fetchMonthlyRainfallData();
    }, []);

    // Filter data when province changes
    useEffect(() => {
        if (province) {
            // console.log("Selected Province:", province);
            // console.log("Monthly Rainfall Data:", monthlyRainfallData);
            const filtered = monthlyRainfallData.filter(
                (item) => item.StationNameEnglish._text === province
            );
            console.log("Filtered Data:", filtered);
            setProvinceData(filtered);
        } else {
            setProvinceData(null); // Reset if no province is selected
        }
    }, [province, monthlyRainfallData]);

    const handleChangeProvince = (event) => {
        const selectedStation = event.target.value;
        setProvince(selectedStation);

        // Filter data for the selected station
        const filteredData = monthlyRainfallData.filter(
            (item) => item.StationNameEnglish._text === selectedStation
        );
        setProvinceData(filteredData);
    };

    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    // chart
    const optionscolumnchart = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            },
            height: 370,
        },
        colors: [primary, secondary],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '42%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },

        stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        yaxis: {
            tickAmount: 4,
        },
        xaxis: {
            // Dynamically generate categories from the data
            categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
        },
    };
    //console.log(provinceData);
    const rainfallData = provinceData ? provinceData.map((station) => ({
        name: station.StationNameEnglish._text, // Use station name as the series name
        data: [
            parseFloat(station.MonthlyRainfall.RainfallJAN._text),
            parseFloat(station.MonthlyRainfall.RainfallFEB._text),
            parseFloat(station.MonthlyRainfall.RainfallMAR._text),
            parseFloat(station.MonthlyRainfall.RainfallAPR._text),
            parseFloat(station.MonthlyRainfall.RainfallMAY._text),
            parseFloat(station.MonthlyRainfall.RainfallJUN._text),
            parseFloat(station.MonthlyRainfall.RainfallJUL._text),
            parseFloat(station.MonthlyRainfall.RainfallAUG._text),
            parseFloat(station.MonthlyRainfall.RainfallSEP._text),
            parseFloat(station.MonthlyRainfall.RainfallOCT._text),
            parseFloat(station.MonthlyRainfall.RainfallNOV._text),
            parseFloat(station.MonthlyRainfall.RainfallDEC._text),
        ],
    })) : [];
    const seriescolumnchart = rainfallData;


    return (
        <> {/* Wrapper element for the select and chart */}
            <DashboardCard title="ThailandMonthlyRainfall" action={
                <Select
                    labelId="province-select"
                    id="province-select"
                    value={province}
                    size="small"
                    onChange={handleChangeProvince}
                >
                    {/* Populate with unique provinces from the data */}
                    {Array.from(new Set(monthlyRainfallData.map(item => item.StationNameEnglish._text)))
                        .map((StationNameEnglish) => (
                            <MenuItem value={StationNameEnglish} key={StationNameEnglish}>
                                {StationNameEnglish}
                            </MenuItem>
                        ))}
                </Select>
            }>
                {header && (
                    <div>
                        Last Build Date : {header.lastBuildDate ? header.lastBuildDate._text : '2024...'}
                    </div>
                )}
                {provinceData && (
                    <Chart
                        options={optionscolumnchart}
                        series={seriescolumnchart}
                        type="bar"
                        height="370px"
                    />
                )}
            </DashboardCard>
        </>
    );
};

export default SalesOverview;
