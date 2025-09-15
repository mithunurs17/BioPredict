import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

type PredictionCardProps = {
  record?: {
    id: string;
    fluidType: string;
    biomarkers: any;
    predictions: any;
    createdAt: string;
  };
  title?: string;
  riskLevel?: string;
  riskValue?: number;
  riskColorStart?: string;
  riskColorEnd?: string;
  factors?: Array<{ type: 'positive' | 'negative' | 'warning', text: string }> | string;
  recommendation?: string;
  fluid?: string;
  potentialDiseases?: string[] | string;
  showFluidType?: boolean;
};

const getPredictionData = (props: PredictionCardProps) => {
  if (props.record) {
    const { record } = props;
    const fluidType = record.fluidType;
    let predictionData: any = {};
    let title = 'Analysis';

    // Determine which prediction to use based on fluid type
    if (fluidType === 'blood') {
      if (record.predictions.diabetes) {
        predictionData = record.predictions.diabetes;
        title = 'Diabetes Risk Assessment';
      } else if (record.predictions.cardiovascular) {
        predictionData = record.predictions.cardiovascular;
        title = 'Cardiovascular Disease Risk Assessment';
      }
    } else if (fluidType === 'saliva') {
      predictionData = record.predictions.oralCancer;
      title = 'Oral Cancer Risk Assessment';
    } else if (fluidType === 'urine') {
      if (record.predictions.kidney) {
        predictionData = record.predictions.kidney;
        title = 'Kidney Disease Risk Assessment';
      } else if (record.predictions.diabetes) {
        predictionData = record.predictions.diabetes;
        title = 'Diabetes Risk Assessment';
      }
    } else if (fluidType === 'csf') {
      if (record.predictions.alzheimer) {
        predictionData = record.predictions.alzheimer;
        title = 'Alzheimer\'s Disease Risk Assessment';
      } else if (record.predictions.brainTumor) {
        predictionData = record.predictions.brainTumor;
        title = 'Brain Tumor Risk Assessment';
      }
    }

    const factors = typeof predictionData.factors === 'string' 
      ? JSON.parse(predictionData.factors) 
      : predictionData.factors;

    const potentialDiseases = typeof predictionData.potentialDiseases === 'string'
      ? JSON.parse(predictionData.potentialDiseases)
      : predictionData.potentialDiseases;

    return {
      title,
      riskLevel: predictionData.riskLevel,
      riskValue: predictionData.riskValue,
      riskColorStart: '#4ade80', // Example color
      riskColorEnd: '#16a34a', // Example color
      factors: factors,
      recommendation: predictionData.recommendation,
      fluid: fluidType,
      potentialDiseases: potentialDiseases,
      createdAt: record.createdAt,
    };
  } else {
    const factors = typeof props.factors === 'string' 
      ? JSON.parse(props.factors) 
      : props.factors;

    const potentialDiseases = typeof props.potentialDiseases === 'string'
      ? JSON.parse(props.potentialDiseases)
      : props.potentialDiseases;

    return {
      title: props.title,
      riskLevel: props.riskLevel,
      riskValue: props.riskValue,
      riskColorStart: props.riskColorStart,
      riskColorEnd: props.riskColorEnd,
      factors: factors,
      recommendation: props.recommendation,
      fluid: props.fluid,
      potentialDiseases: potentialDiseases,
      createdAt: new Date().toISOString(), // Fallback for direct props
    };
  }
};

export function PredictionCard(props: PredictionCardProps) {
  const data = getPredictionData(props);

  if (!data || !data.riskLevel) {
    return null; // Don't render if no valid data
  }

  const { 
    title,
    riskLevel,
    riskValue,
    factors,
    recommendation,
    fluid,
    potentialDiseases,
    createdAt
  } = data;

  // Determine risk level color
  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'minimal':
        return 'text-green-500';
      case 'low':
        return 'text-green-400';
      case 'moderate':
        return 'text-yellow-500';
      case 'high':
        return 'text-orange-500';
      case 'very high':
        return 'text-red-500';
      default:
        return 'text-white';
    }
  };

  // Determine factor color based on type
  const getFactorColor = (type: string) => {
    switch (type) {
      case 'negative':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'positive':
        return 'text-green-500';
      default:
        return 'text-zinc-300';
    }
  };

  const riskLevelColor = getRiskLevelColor(riskLevel);

  // Format the date if available
  const formattedDate = createdAt 
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : null;

  return (
    <div className="bg-zinc-900 rounded-lg p-6 shadow-lg">
      <div className="bg-indigo-700/80 px-6 py-3 -mx-6 -mt-6 mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {formattedDate && <span className="text-sm text-indigo-200">{formattedDate}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col items-center justify-center p-4 bg-zinc-800 rounded-lg">
          <span className={`text-6xl font-bold mb-2 ${riskLevelColor}`}>{riskValue}%</span>
          <p className={`text-xl font-medium ${riskLevelColor}`}>{riskLevel} Risk</p>
          <p className="text-zinc-400 text-sm mt-1">Your risk level is {riskValue}%, which is considered {riskLevel.toLowerCase()}.</p>
        </div>
        
        <div className="p-4 bg-zinc-800 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-white">Risk Assessment</h4>
          <div className="space-y-1">
            <p><span className="text-zinc-400">Risk Level:</span> <span className={riskLevelColor}>{riskLevel}</span></p>
            <p><span className="text-zinc-400">Risk Value:</span> <span className={riskLevelColor}>{riskValue}%</span></p>
          </div>
        </div>
      </div>

      {factors && factors.length > 0 && (
        <div className="bg-zinc-800 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-semibold mb-3 text-white">Health Status</h4>
          <ul className="space-y-2">
            {factors.map((factor: any, index: number) => (
              <li key={index} className="flex items-start">
                <span className={`h-5 w-5 mr-2 flex-shrink-0 mt-0.5 ${getFactorColor(factor.type)}`}>
                  {factor.type === 'negative' ? (
                    <ExclamationCircleIcon className="h-5 w-5" />
                  ) : factor.type === 'warning' ? (
                    <ExclamationTriangleIcon className="h-5 w-5" />
                  ) : (
                    <CheckCircleIcon className="h-5 w-5" />
                  )}
                </span>
                <span className={getFactorColor(factor.type)}>
                  {factor.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {potentialDiseases && potentialDiseases.length > 0 && (
        <div className="bg-zinc-800 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-semibold mb-3 text-white">Potential Health Concerns</h4>
          <ul className="space-y-2">
            {potentialDiseases.map((disease: string, index: number) => (
              <li key={index} className="flex items-start text-red-400">
                <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{disease}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendation && (
        <div className="bg-zinc-800 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-semibold mb-3 text-white">Recommended Actions</h4>
          <div className="flex items-start">
            <span className={`h-5 w-5 mr-2 flex-shrink-0 mt-0.5 ${riskLevelColor}`}>
              {riskLevel.toLowerCase() === 'minimal' || riskLevel.toLowerCase() === 'low' ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                <ExclamationCircleIcon className="h-5 w-5" />
              )}
            </span>
            <p className={riskLevelColor}>{recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}