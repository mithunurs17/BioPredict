import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PredictionCard } from '@/components/results/prediction-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/api';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Activity, Calendar, User, Beaker } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { HealthInsights } from '@/components/dashboard/health-insights';
import { Button } from '@/components/ui/button';

type BiomarkerRecord = {
  id: string;
  fluidType: string;
  biomarkers: any;
  predictions: any;
  createdAt: string;
};

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  const [records, setRecords] = useState<BiomarkerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      setLocation('/login');
      return;
    }

    const fetchRecords = async () => {
      try {
        const response = await apiRequest('GET', '/predictions/history');
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !Array.isArray(data.records)) {
          throw new Error('Invalid response format');
        }
        
        setRecords(data.records);
        setError(null);
      } catch (err) {
        console.error('Error fetching records:', err);
        setError(err instanceof Error ? err.message : 'Failed to load prediction history');
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [user, token, setLocation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return null;
  }

  const formattedDate = user.createdAt 
    ? format(new Date(user.createdAt), 'MMMM d, yyyy')
    : 'N/A';

  const bloodRecords = records.filter(record => record.fluidType === 'blood');
  const salivaRecords = records.filter(record => record.fluidType === 'saliva');
  const urineRecords = records.filter(record => record.fluidType === 'urine');
  const csfRecords = records.filter(record => record.fluidType === 'csf');

  return (
    <>
      <Header />
      <main className="min-h-screen text-white relative">
        <AnimatedBackground />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold mb-8 bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent"
            >
              Welcome, {user.name}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 hover:border-fuchsia-500/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-fuchsia-500/10 rounded-lg">
                    <User className="w-6 h-6 text-fuchsia-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Member Since</p>
                    <p className="text-lg font-semibold">{formattedDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 hover:border-fuchsia-500/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-fuchsia-500/10 rounded-lg">
                    <Activity className="w-6 h-6 text-fuchsia-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Total Analyses</p>
                    <p className="text-lg font-semibold">{records.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 hover:border-fuchsia-500/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-fuchsia-500/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-fuchsia-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Last Analysis</p>
                    <p className="text-lg font-semibold">
                      {records.length > 0
                        ? format(new Date(records[0].createdAt), 'MMM d, yyyy')
                        : 'No analyses yet'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
            >
              <div className="lg:col-span-2">
                <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 mb-8">
                  <h2 className="text-2xl font-semibold mb-6">Analysis History</h2>
                  {records.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="p-4 bg-fuchsia-500/10 rounded-full mb-4">
                        <Beaker className="w-12 h-12 text-fuchsia-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No Analysis Records Yet</h3>
                      <p className="text-zinc-400 mb-6 max-w-md">
                        Start your health journey by analyzing your biomarkers. Choose from blood, saliva, urine, or CSF analysis to get personalized insights.
                      </p>
                      <Button
                        onClick={() => setLocation('/home')}
                        className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Start Your First Analysis
                      </Button>
                    </motion.div>
                  ) : (
                    <Tabs defaultValue="blood" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 bg-zinc-800/50">
                        <TabsTrigger value="blood" className="data-[state=active]:bg-fuchsia-500/20 data-[state=active]:text-fuchsia-400">
                          Blood
                        </TabsTrigger>
                        <TabsTrigger value="saliva" className="data-[state=active]:bg-fuchsia-500/20 data-[state=active]:text-fuchsia-400">
                          Saliva
                        </TabsTrigger>
                        <TabsTrigger value="urine" className="data-[state=active]:bg-fuchsia-500/20 data-[state=active]:text-fuchsia-400">
                          Urine
                        </TabsTrigger>
                        <TabsTrigger value="csf" className="data-[state=active]:bg-fuchsia-500/20 data-[state=active]:text-fuchsia-400">
                          CSF
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="blood" className="mt-6">
                        {bloodRecords.length > 0 ? (
                          <div className="grid gap-6">
                            {bloodRecords.map((record) => (
                              <PredictionCard key={record.id} record={record} />
                            ))}
                          </div>
                        ) : (
                          <p className="text-zinc-400 text-center py-8">No blood analysis records found</p>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="saliva" className="mt-6">
                        {salivaRecords.length > 0 ? (
                          <div className="grid gap-6">
                            {salivaRecords.map((record) => (
                              <PredictionCard key={record.id} record={record} />
                            ))}
                          </div>
                        ) : (
                          <p className="text-zinc-400 text-center py-8">No saliva analysis records found</p>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="urine" className="mt-6">
                        {urineRecords.length > 0 ? (
                          <div className="grid gap-6">
                            {urineRecords.map((record) => (
                              <PredictionCard key={record.id} record={record} />
                            ))}
                          </div>
                        ) : (
                          <p className="text-zinc-400 text-center py-8">No urine analysis records found</p>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="csf" className="mt-6">
                        {csfRecords.length > 0 ? (
                          <div className="grid gap-6">
                            {csfRecords.map((record) => (
                              <PredictionCard key={record.id} record={record} />
                            ))}
                          </div>
                        ) : (
                          <p className="text-zinc-400 text-center py-8">No CSF analysis records found</p>
                        )}
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <HealthInsights records={records} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}