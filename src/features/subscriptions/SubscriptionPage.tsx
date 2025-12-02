import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SubscriptionPlan } from '../../../../shared/types';
import { API_URL } from '@/config/api';
import Button from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '@/components/ui/Spinner';

const SubscriptionPage = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${API_URL}/subscriptions/plans`);
        setPlans(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePurchase = async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    if (!user) {
      toast.error('برای خرید اشتراک باید وارد شوید.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/subscriptions/purchase`, {
        userId: user.id,
        planId,
        billingCycle,
      });
      setUser(response.data.user);
      toast.success('اشتراک با موفقیت خریداری شد.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در خرید اشتراک');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">پلان‌های اشتراک</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
            <ul className="space-y-2 mb-8 flex-grow">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="text-center">
              {plan.monthlyPrice > 0 ? (
                <>
                  <Button className="w-full mb-2" onClick={() => handlePurchase(plan.id, 'monthly')}>خرید ماهانه - {plan.monthlyPrice.toLocaleString()} تومان</Button>
                  <Button variant="secondary" className="w-full" onClick={() => handlePurchase(plan.id, 'yearly')}>خرید سالانه - {plan.yearlyPrice.toLocaleString()} تومان</Button>
                </>
              ) : (
                <Button variant="secondary" disabled>اشتراک فعال</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
