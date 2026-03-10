import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function OrderCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-red-600">
              Payment Cancelled
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="text-lg text-gray-700">
              Your payment was cancelled or failed to process.
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-2">
                Don't worry - no charges were made to your account.
              </p>
              <p className="text-sm text-gray-500">
                Your cart items are still saved and waiting for you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => navigate('/cart')}
                size="lg"
                className="bg-sky-600 hover:bg-sky-700 flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Return to Cart
              </Button>
              
              <Button
                onClick={() => navigate('/order')}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
