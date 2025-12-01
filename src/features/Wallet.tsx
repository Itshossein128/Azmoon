import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/store/userStore';
import { API_URL } from '@/config/api';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const user = useUserStore(state => state.user);

  const fetchBalance = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/wallet/${user.id}`);
      setBalance(response.data.balance);
    } catch (error) {
      toast.error('خطا در دریافت موجودی کیف پول');
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [user]);

  const handleCharge = async () => {
    if (!user || !amount) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/wallet/charge`, {
        userId: user.id,
        amount: parseInt(amount, 10),
      });
      setBalance(response.data.newBalance);
      setAmount('');
      toast.success('کیف پول با موفقیت شارژ شد.');
    } catch (error) {
      toast.error('خطا در شارژ کیف پول');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>ابتدا باید وارد شوید.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">کیف پول</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <p className="text-lg">موجودی فعلی:</p>
        <p className="text-3xl font-bold">{balance.toLocaleString()} تومان</p>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">شارژ حساب</h2>
        <div className="flex gap-4">
          <Input
            type="number"
            placeholder="مبلغ به تومان"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleCharge} disabled={loading}>
            {loading ? 'در حال پردازش...' : 'پرداخت'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
