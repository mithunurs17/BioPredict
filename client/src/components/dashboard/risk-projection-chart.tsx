import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RiskProjectionChartProps {
  currentRiskData?: number[];
  projectedRiskData?: number[];
  labels?: string[];
}

export function RiskProjectionChart({
  currentRiskData = [65, 67, 70, 68, 72, 75],
  projectedRiskData = [65, 63, 58, 52, 48, 42],
  labels = ['Now', '1 Month', '2 Months', '3 Months', '4 Months', '5 Months']
}: RiskProjectionChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Current Risk Trajectory',
        data: currentRiskData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Projected Risk (With Changes)',
        data: projectedRiskData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        borderDash: [10, 5],
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(209, 213, 219)',
          font: {
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: 'rgb(209, 213, 219)',
        bodyColor: 'rgb(209, 213, 219)',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}% risk`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(99, 102, 241, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: function(value: any) {
            return value + '%';
          },
        },
        title: {
          display: true,
          text: 'Risk Level',
          color: 'rgb(209, 213, 219)',
        },
      },
      x: {
        grid: {
          color: 'rgba(99, 102, 241, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
  };

  return (
    <Card className="bg-gradient-to-br from-violet-900/40 to-indigo-900/40 border-violet-800/50 backdrop-blur-sm" data-testid="card-risk-projection">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-violet-100">
          <TrendingDown className="w-5 h-5 mr-2 text-violet-400" />
          Risk Projection
        </CardTitle>
        <CardDescription className="text-violet-300">
          Compare current trajectory vs. projected improvements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full" data-testid="div-chart-container">
          <Line data={data} options={options} />
        </div>
        <div className="mt-4 p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
          <p className="text-sm text-green-300">
            <strong>Potential Improvement:</strong> By implementing recommended lifestyle changes, 
            you could reduce your risk by up to <span className="font-bold text-green-400">35%</span> over 5 months.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
