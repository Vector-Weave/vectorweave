import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cartService } from '@/services/cartService';
import type { CartData } from '@/services/cartService';
import { stripeService } from '@/services/stripeService';
import { getUser, isAuthenticated } from '@/lib/auth';
import { Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'direct' | 'stripe'>('direct');
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setLoggedIn(authenticated);
      if (!authenticated) {
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (loggedIn) {
      loadCart();
    }
  }, [loggedIn]);

  const loadCart = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await getUser();
      if (user) {
        const cartData = await cartService.getCart(user.id);
        setCart(cartData);
      }
    } catch (err: any) {
      setError('Failed to load cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId: number) => {
    setError('');
    try {
      const user = await getUser();
      if (user) {
        await cartService.removeFromCart(user.id, cartItemId);
        await loadCart();
        await refreshCartCount(); // Update cart count across the app
      }
    } catch (err: any) {
      setError('Failed to remove item');
      console.error(err);
    }
  };

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    
    setError('');
    try {
      const user = await getUser();
      if (user) {
        await cartService.clearCart(user.id);
        await loadCart();
        await refreshCartCount(); // Update cart count across the app
      }
    } catch (err: any) {
      setError('Failed to clear cart');
      console.error(err);
    }
  };

  const checkout = async () => {
    if (!cart || cart.items.length === 0) return;

    setIsCheckingOut(true);
    setError('');
    setSuccess('');

    try {
      const user = await getUser();
      if (!user) {
        setError('Unable to get user information');
        return;
      }

      if (paymentMethod === 'stripe') {
        // Redirect to Stripe checkout
        const baseUrl = window.location.origin;
        const checkoutSession = await stripeService.createCheckoutSession({
          supabaseUserId: user.id,
          successUrl: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${baseUrl}/order/cancel`
        });
        
        // Redirect to Stripe checkout page
        window.location.href = checkoutSession.url;
        return;
      }

      // Direct checkout - use backend checkout endpoint
      const orderResponses = await cartService.checkout(user.id);
      
      const failedOrders = orderResponses.filter((r: any) => !r.orderId);

      if (failedOrders.length > 0) {
        setError(`Failed to create ${failedOrders.length} order(s)`);
      } else {
        setSuccess(`All ${orderResponses.length} order(s) placed successfully!`);
        await loadCart(); // Cart is already cleared by backend
        await refreshCartCount(); // Update cart count across the app
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      }

    } catch (err: any) {
      setError(err.response?.data || err.message || 'Checkout failed');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!loggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <ShoppingCart className="w-8 h-8" />
                Shopping Cart
              </h1>
              {cart && cart.itemCount > 0 && (
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  Clear Cart
                </Button>
              )}
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading cart...</p>
              </div>
            ) : !cart || cart.itemCount === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
                  <Button onClick={() => navigate('/order')}>
                    Start Building
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <Card key={item.cartItemId}>
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">{item.plasmidName}</h3>
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Build Type:</span>{' '}
                              {item.buildType.replace('_', ' ')}
                            </div>
                            {item.backboneName && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Backbone:</span> {item.backboneName}
                              </div>
                            )}
                            <div className="text-sm text-gray-500 mt-1">
                              Added {new Date(item.addedAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                ${item.price}
                              </div>
                            </div>
                            <Button
                              onClick={() => removeItem(item.cartItemId)}
                              variant="outline"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-sky-50">
                  <CardContent className="py-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => setPaymentMethod('direct')}
                          variant={paymentMethod === 'direct' ? 'default' : 'outline'}
                          className="flex-1"
                        >
                          Direct Checkout
                        </Button>
                        <Button
                          onClick={() => setPaymentMethod('stripe')}
                          variant={paymentMethod === 'stripe' ? 'default' : 'outline'}
                          className="flex-1 flex items-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          Pay with Stripe
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm text-gray-600">
                          {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
                        </div>
                        <div className="text-3xl font-bold">
                          Total: ${cart.totalPrice}
                        </div>
                      </div>
                      <Button
                        onClick={checkout}
                        disabled={isCheckingOut}
                        size="lg"
                        className="bg-green-500 hover:bg-green-600 text-white text-lg px-8"
                      >
                        {isCheckingOut ? 'Processing...' : 'Checkout'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
