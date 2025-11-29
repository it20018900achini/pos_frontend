import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, ShoppingBag, Phone, Mail, User, Calendar, ArrowBigLeft } from "lucide-react";
import { getStatusColor } from "../../../utils/getStatusColor";
import { calculateCustomerStats } from "../../cashier/customer/utils/customerUtils";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAllCustomers } from "../../../Redux Toolkit/features/customer/customerThunks";
import { clearCustomerOrders } from "../../../Redux Toolkit/features/order/orderSlice";
import { getOrdersByCustomer } from "../../../Redux Toolkit/features/order/orderThunks";
import CustomerOrderPage from "./CustomerOrdersPage";
import CustomerSummary from "./CustomerSummary";
import CustomerRefundsPage from "./CustomerRefundsPage";
import CustomerPaymentsPage from "./CustomerPaymentsPage";

const Customers = () => {
    const [tab,setTab]=useState(0)

  // Sample data - in a real app, this would come from an API
  // const initialCustomers = [
  //   {
  //     id: 1,
  //     name: "Rahul Mehta",
  //     phone: "+91 9876543200",
  //     email: "rahul.mehta@example.com",
  //     totalOrders: 12,
  //     totalSpent: "LKR 8,450",
  //     lastOrder: "2023-08-10",
  //     loyaltyStatus: "Gold",
  //   },
  //   {
  //     id: 2,
  //     name: "Sneha Gupta",
  //     phone: "+91 9876543201",
  //     email: "sneha.gupta@example.com",
  //     totalOrders: 8,
  //     totalSpent: "LKR 5,200",
  //     lastOrder: "2023-08-05",
  //     loyaltyStatus: "Silver",
  //   },
  //   {
  //     id: 3,
  //     name: "Arjun Sharma",
  //     phone: "+91 9876543202",
  //     email: "arjun.sharma@example.com",
  //     totalOrders: 5,
  //     totalSpent: "LKR 3,100",
  //     lastOrder: "2023-07-28",
  //     loyaltyStatus: "Bronze",
  //   },
  //   {
  //     id: 4,
  //     name: "Meera Patel",
  //     phone: "+91 9876543203",
  //     email: "meera.patel@example.com",
  //     totalOrders: 15,
  //     totalSpent: "LKR 12,750",
  //     lastOrder: "2023-08-12",
  //     loyaltyStatus: "Gold",
  //   },
  //   {
  //     id: 5,
  //     name: "Vikrant Singh",
  //     phone: "+91 9876543204",
  //     email: "vikrant.singh@example.com",
  //     totalOrders: 3,
  //     totalSpent: "LKR 1,850",
  //     lastOrder: "2023-07-15",
  //     loyaltyStatus: "Bronze",
  //   },
  //   {
  //     id: 6,
  //     name: "Priya Desai",
  //     phone: "+91 9876543205",
  //     email: "priya.desai@example.com",
  //     totalOrders: 7,
  //     totalSpent: "LKR 4,900",
  //     lastOrder: "2023-08-01",
  //     loyaltyStatus: "Silver",
  //   },
  // ];

  // Sample order history data
  // const sampleOrderHistory = [
  //   {
  //     id: "ORD-7891",
  //     date: "2023-08-10",
  //     amount: "LKR 1,250",
  //     items: 5,
  //     status: "Completed",
  //     paymentMode: "UPI",
  //   },
  //   {
  //     id: "ORD-7650",
  //     date: "2023-07-25",
  //     amount: "LKR 850",
  //     items: 3,
  //     status: "Completed",
  //     paymentMode: "Cash",
  //   },
  //   {
  //     id: "ORD-7432",
  //     date: "2023-07-12",
  //     amount: "LKR 1,500",
  //     items: 6,
  //     status: "Completed",
  //     paymentMode: "Card",
  //   },
  //   {
  //     id: "ORD-7290",
  //     date: "2023-06-30",
  //     amount: "LKR 720",
  //     items: 2,
  //     status: "Completed",
  //     paymentMode: "UPI",
  //   },
  // ];

  const { customerOrders } = useSelector((state) => state.order);

  const { customers } = useSelector((state) => state.customer);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  // const [orderHistory, setOrderHistory] = useState(sampleOrderHistory);
  const dispatch = useDispatch();

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // const getLoyaltyStatusColor = (status) => {
  //   switch (status?.toLowerCase()) {
  //     case "gold":
  //       return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
  //     case "silver":
  //       return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
  //     case "bronze":
  //       return "bg-amber-100 text-amber-800 hover:bg-amber-100/80";
  //     default:
  //       return "bg-primary/10 text-primary hover:bg-primary/20";
  //   }
  // };

  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const openCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    // In a real app, you would fetch the customer's order history here
    setIsCustomerDetailsOpen(true);
    dispatch(clearCustomerOrders());
    // Fetch customer orders
    if (customer.id) {
      dispatch(getOrdersByCustomer(customer.id));
    }
  };

  console.log("customerOrders", customerOrders);
  const customerStats = selectedCustomer
    ? calculateCustomerStats(customerOrders)
    : null;

  const displayCustomer = selectedCustomer
    ? {
        ...selectedCustomer,
        ...customerStats,
      }
    : null;

  console.log("display customer ", displayCustomer);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Customer Overview</h1>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-lg font-medium text-gray-500">
                Total Customers
              </h3>
              <p className="text-3xl font-bold mt-2">{customers.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-lg font-medium text-gray-500">
                Gold Members
              </h3>
              <p className="text-3xl font-bold mt-2 text-primary">
                {customers.filter((c) => c.loyaltyStatus === "Gold").length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-lg font-medium text-gray-500">
                Avg. Orders per Customer
              </h3>
              <p className="text-3xl font-bold mt-2 text-blue-600">
                {Math.round(
                  customers.reduce((sum, c) => sum + c.totalOrders, 0) /
                    customers.length
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>

                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.fullName}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{customer.phone}</span>
                        <span className="text-xs text-gray-500">
                          {customer.email}
                        </span>
                      </div>
                    </TableCell>
        
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCustomerDetails(customer)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-4 text-gray-500"
                  >
                    No customers found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <Dialog
          open={isCustomerDetailsOpen}
          onOpenChange={setIsCustomerDetailsOpen}
        >
          <DialogContent className=" min-w-[80%]   w-full max-w-fit h-full 
          md:w-[90vw] md:h-[99vh] 
          p-6           
          ">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            <div className=" py-4 space-y-2">
              {/* Customer Info */}
              <>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Name</p>
                          <p className="text-sm text-gray-500">
                            {displayCustomer.fullName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-gray-500">
                            {selectedCustomer.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-gray-500">
                            {selectedCustomer.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">Total Orders</p>
                          <p className="text-sm text-gray-500">
                            {displayCustomer.totalOrders} orders
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>

              {/* Order History */}
             

           
            </div>


<div className="flex w-full justify-between border-t pt-3">
{
tab==0&&<h1 className="text-3xl font-bold">Summary</h1>
}
{
tab==1&&<h1 className="text-3xl font-bold">Orders</h1>
}
{
tab==2&&<h1 className="text-3xl font-bold">Refunds</h1>
}
{
tab==3&&<h1 className="text-3xl font-bold">Payments</h1>
}

        <div className=' md:flex  gap-2'>
         {tab!==0&&<Button  onClick={()=>{setTab(0)}}  variant="secondary"><ArrowBigLeft/></Button>} 
        <Button onClick={()=>{setTab(1)}}  variant={tab==1?"secondary":"default"} className="flex items-center gap-2 border">
          Orders
        </Button>
        <Button onClick={()=>{setTab(2)}} variant={tab==2?"secondary":"default"}  className="flex items-center gap-2 border">
          Refunds
        </Button>
        <Button  onClick={()=>{setTab(3)}}  variant={tab==3?"secondary":"default"}  className="flex items-center gap-2 border">
          Customer Payments
        </Button>
        </div>
</div>

        


        

        {tab==0 &&<>
         <div className="w-full h-full overflow-auto">
        <CustomerSummary customerId={displayCustomer?.id}/>
      </div>
        </>}

        {tab==1 &&<div className="w-full h-full overflow-auto"> <CustomerOrderPage customerId={displayCustomer?.id}/>  </div>}

        {
          tab==2 &&<>
        <div className="w-full h-full overflow-auto"><CustomerRefundsPage customerId={displayCustomer?.id}/></div>
          </>
        }
        {
          tab==3?
                        <div className="w-full h-full overflow-auto"><CustomerPaymentsPage customer={displayCustomer}/></div>
                        :""
        }



             {/* <Card className="w-full overflow-x-auto">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                       
                        <TableHead>Amount</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerOrders?.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                         
                          <TableCell>{order.totalAmount}</TableCell>
                          <TableCell>{order.items.map((orderItem)=><p>{
                            orderItem.product?.name?.slice(0,15)}...</p>)}</TableCell>
                          <TableCell>{order.paymentType}</TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(order.status)}
                              variant="secondary"
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card> */}
            <DialogFooter>
              <Button onClick={() => setIsCustomerDetailsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Customers;
