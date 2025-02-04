import { component$, useTask$, useSignal } from '@builder.io/qwik';
import { Chart, type ChartTypeRegistry } from 'chart.js/auto';

interface ChartProps {
  type: keyof ChartTypeRegistry;
  data: any;
  options: any;
}

export default component$<ChartProps>(({ type, data, options }) => {
  const canvasRef = useSignal<HTMLCanvasElement>();

  useTask$(({ track }) => {
    track(() => canvasRef.value);

    if (!canvasRef.value) return;

    const chart = new Chart(canvasRef.value, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: type !== 'pie' && type !== 'doughnut',
        color: 'white', // Base color for all text
        plugins: {
          legend: {
            labels: {
              color: 'white', // Legend text
              font: {
                size: 12, // Adjust font size for better visibility on small screens
              },
            },
          },
          tooltip: {
            titleColor: 'white', // Tooltip title
            bodyColor: 'white', // Tooltip body
            backgroundColor: 'rgba(0,0,0,0.7)', // Better contrast
          },
        },
        scales: {
          x: {
            // Don't show it on pie charts
            display: type !== 'pie' && type !== 'doughnut',
            title: {
              color: 'white', // X-axis title
            },
            ticks: {
              color: 'white', // X-axis ticks
              font: {
                size: 12, // Adjust font size for better visibility on small screens
              },
            },
            grid: {
              color: 'rgba(255,255,255,0.1)', // Grid lines
            },
          },
          y: {
            display: type !== 'pie' && type !== 'doughnut',
            title: {
              color: 'white', // Y-axis title
            },
            ticks: {
              color: 'white', // Y-axis ticks
              font: {
                size: 12, // Adjust font size for better visibility on small screens
              },
            },
            grid: {
              color: 'rgba(255,255,255,0.1)', // Grid lines
            },
            beginAtZero: true,
          },
        },
        ...options,
      },
    });

    return () => chart.destroy();
  });

return (
  <div class="relative h-full w-full max-h-[100vh]">
    <canvas ref={canvasRef} class="h-full w-full" />
  </div>
);});