import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const lifestyleOptions = [
  { value: 'walk-30', label: 'Walk 30 minutes/day', impact: 15 },
  { value: 'reduce-sugar', label: 'Reduce sugar intake', impact: 12 },
  { value: 'sleep-8hrs', label: 'Sleep 8 hours/night', impact: 18 },
  { value: 'meditation', label: 'Daily meditation (15 min)', impact: 10 },
  { value: 'hydration', label: 'Drink 8 glasses of water', impact: 8 },
  { value: 'no-smoking', label: 'Quit smoking', impact: 25 },
];

export function LifestyleSimulator() {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [simulationResult, setSimulationResult] = useState<{ reduction: number; message: string } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    if (!selectedOption) return;

    setIsSimulating(true);

    // Simulate loading
    setTimeout(() => {
      const option = lifestyleOptions.find(opt => opt.value === selectedOption);
      if (option) {
        setSimulationResult({
          reduction: option.impact,
          message: `${option.label} could reduce your health risks by approximately ${option.impact}%!`
        });
      }
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-800/50 backdrop-blur-sm" data-testid="card-lifestyle-simulator">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-blue-100">
          <Activity className="w-5 h-5 mr-2 text-cyan-400" />
          Lifestyle Simulator
        </CardTitle>
        <CardDescription className="text-blue-300">
          See how lifestyle changes can impact your health
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-blue-200">Choose a lifestyle change:</label>
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger className="bg-blue-950/50 border-blue-700 text-blue-100" data-testid="select-lifestyle-option">
              <SelectValue placeholder="Select a change..." />
            </SelectTrigger>
            <SelectContent>
              {lifestyleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSimulate}
          disabled={!selectedOption || isSimulating}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
          data-testid="button-simulate"
        >
          {isSimulating ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Simulating...
            </div>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 mr-2" />
              Simulate Impact
            </>
          )}
        </Button>

        {simulationResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg"
            data-testid="div-simulation-result"
          >
            <div className="flex items-center justify-center mb-2">
              <div className="text-3xl font-bold text-green-400">
                -{simulationResult.reduction}%
              </div>
            </div>
            <p className="text-sm text-green-200 text-center">
              {simulationResult.message}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
