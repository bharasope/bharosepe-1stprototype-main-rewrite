
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the splash screen instead of creating a loop
    navigate('/splash');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Loading Bharose Pe...</h1>
        <p className="text-xl text-muted-foreground">Har Deal Mein Bharosa</p>
      </div>
    </div>
  );
};

export default Index;
