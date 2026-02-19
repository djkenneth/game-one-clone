import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getWallet, getTransactions, deposit, withdraw } from '@/api/wallet';
import { formatNumberToCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Wallet, Transaction } from '@/types';

interface AmountForm {
  amount: number;
}

const WalletPage = () => {
  const { toast } = useToast();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [action, setAction] = useState<'deposit' | 'withdraw' | null>(null);

  const { register, handleSubmit, reset } = useForm<AmountForm>();

  const load = async () => {
    try {
      setIsLoading(true);
      const [walletRes, txRes] = await Promise.all([getWallet(), getTransactions(1, 10)]);
      setWallet(walletRes.data.wallet);
      setTransactions(txRes.data.transactions);
    } catch {
      // No wallet yet
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (data: AmountForm) => {
    try {
      setIsSaving(true);
      if (action === 'deposit') {
        await deposit(Number(data.amount));
        toast({ description: 'Deposit successful.' });
      } else {
        await withdraw(Number(data.amount));
        toast({ description: 'Withdrawal successful.' });
      }
      setAction(null);
      reset();
      load();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error?.response?.data?.error?.message ?? 'Transaction failed.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 rounded-lg" />
        <Skeleton className="h-48 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Wallet</h2>
        <p className="text-sm text-gray-500">Manage your wallet balance.</p>
      </div>

      {/* Balance Card */}
      <div className="rounded-lg border bg-gradient-to-r from-red-500 to-red-700 p-6 text-white">
        <p className="text-sm opacity-80">Available Balance</p>
        <p className="mt-2 text-4xl font-bold">
          {wallet ? formatNumberToCurrency(Number(wallet.balance)) : '₱0.00'}
        </p>
        <div className="mt-4 flex gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setAction(action === 'deposit' ? null : 'deposit')}
          >
            Deposit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
            onClick={() => setAction(action === 'withdraw' ? null : 'withdraw')}
          >
            Withdraw
          </Button>
        </div>
      </div>

      {/* Deposit/Withdraw Form */}
      {action && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-3 font-medium capitalize">{action}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
            <div className="flex-1">
              <Label className="sr-only">Amount</Label>
              <Input
                {...register('amount', { required: true, min: 1 })}
                type="number"
                min={1}
                step="0.01"
                placeholder="Enter amount..."
              />
            </div>
            <Button type="submit" variant="solidred" disabled={isSaving}>
              {isSaving ? 'Processing...' : 'Confirm'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setAction(null)}>
              Cancel
            </Button>
          </form>
        </div>
      )}

      <Separator />

      {/* Transactions */}
      <div>
        <h3 className="mb-3 font-medium">Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-500">No transactions yet.</p>
        ) : (
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <Badge
                        variant={tx.type === 'DEPOSIT' ? 'default' : 'secondary'}
                        className="capitalize text-xs"
                      >
                        {tx.type.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`font-medium ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {tx.type === 'DEPOSIT' ? '+' : '-'}
                      {formatNumberToCurrency(Number(tx.amount))}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {tx.status ?? 'completed'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
