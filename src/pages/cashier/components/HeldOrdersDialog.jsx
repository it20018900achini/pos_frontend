import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pause, Play, Trash2 } from 'lucide-react'; // Added Trash for better UX
import { useSelector, useDispatch } from 'react-redux';
import { resumeOrder, selectHeldOrders } from '../../../Redux Toolkit/features/cart/cartSlice';
import { useToast } from '../../../components/ui/use-toast';

const HeldOrdersDialog = ({
  showHeldOrdersDialog,
  setShowHeldOrdersDialog,
  selectedBranchId // Pass this from CreateOrderPage
}) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // Get all held orders from Redux
  const allHeldOrders = useSelector(selectHeldOrders);

  // Filter orders to only show those belonging to the current branch
  // Also handles legacy orders that might not have a branchId
  const branchHeldOrders = allHeldOrders.filter(order => 
    order.branchId === selectedBranchId || !order.branchId
  );

  const handleResumeOrder = (order) => {
    // Pass both the order and the branchId to sync localStorage
    dispatch(resumeOrder({ order, selectedBranchId }));
    setShowHeldOrdersDialog(false);

    toast({
      title: "Order Resumed",
      description: `Order successfully loaded to cart.`,
    });
  };

  return (
    <Dialog open={showHeldOrdersDialog} onOpenChange={setShowHeldOrdersDialog}>
      <DialogContent className="max-w-2xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
            <Pause className="w-5 h-5 text-amber-500" />
            Held Orders 
            <span className="text-slate-400 font-medium ml-2 text-sm uppercase tracking-widest">
              Branch: {selectedBranchId}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {branchHeldOrders.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Pause className="w-12 h-12 mx-auto mb-3 text-slate-300 animate-pulse" />
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No orders on hold for this terminal</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {branchHeldOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden hover:border-indigo-400 transition-all group">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm">
                             #{order.id.toString().slice(-6)}
                           </h3>
                           <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                             {order.items.reduce((acc, item) => acc + item.quantity, 0)} Items
                           </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-2">
                          {new Date(order.timestamp).toLocaleDateString()} at {new Date(order.timestamp).toLocaleTimeString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right mr-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total</p>
                            <p className="text-sm font-black text-indigo-600">LKR {order.total?.toFixed(2)}</p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 font-bold uppercase text-[10px] tracking-widest"
                          onClick={() => handleResumeOrder(order)}
                        >
                          <Play className="w-3 h-3 mr-1 fill-current" />
                          Resume
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-start border-t pt-4">
          <Button variant="ghost" className="font-bold uppercase text-xs tracking-widest" onClick={() => setShowHeldOrdersDialog(false)}>
            Close Terminal View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HeldOrdersDialog;