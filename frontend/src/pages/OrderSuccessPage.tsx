import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshCartCount } = useCart();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Refresh cart count since checkout was successful
    refreshCartCount();
  }, [refreshCartCount]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-green-600">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="text-lg text-gray-700">
              Thank you for your order. Your payment has been processed successfully.
            </div>
            
            <div className="bg-sky-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-2">
                Your plasmid constructs are now being prepared by our team.
              </p>
              <p className="text-sm text-gray-500">
                You will receive a confirmation email shortly with your order details.
              </p>
              {sessionId && (
                <p className="text-xs text-gray-400 mt-4">
                  Session ID: {sessionId}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => navigate('/orders')}
                size="lg"
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Package className="w-5 h-5" />
                View My Orders
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={() => navigate('/order')}
                variant="outline"
                size="lg"
              >
                Place Another Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
