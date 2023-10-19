import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Tooltip,
    PointElement,
    LineElement,
    Title,
} from 'chart.js';
import { Line } from "react-chartjs-2";
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Title
);

function formatDateTimeForChart(dateTimeString) {
    return new Date(dateTimeString).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

const CoLevel = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                label: 'co_ppm',
                backgroundColor: "purple",
            },
        ],
    });

    const fetchData = async () => {
        try {
            const response = await axios.get('https://inhalesafe.vercel.app/api/get');
            const newData = response.data.data;

            // Filter data for today
            const today = new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });

            const todayData = newData.filter((item) =>
                formatDateTimeForChart(item.createdAt).startsWith(today)
            );

            const newLabels = todayData.map(item => formatDateTimeForChart(item.createdAt));
            const newValues = todayData.map(item => parseFloat(item.co_ppm));

            setChartData({
                labels: newLabels,
                datasets: [
                    {
                        data: newValues,
                        label: 'co_ppm',
                        backgroundColor: "red",
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <>
            <div className="w-1100 h-screen flex mx-auto my-auto">
                <Line data={chartData} options={{
                    maintainAspectRatio: false, // Allow the chart to overflow the container
                    plugins: {
                        title: {
                            display: true,
                            text: `CO Level at ${formatDateTimeForChart(new Date())}`,
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'co_ppm',
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Time',
                            },
                        },
                    },
                }} />
            </div>
        </>
    );
};

export default CoLevel;
