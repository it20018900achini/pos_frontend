import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

const OrderItemTable = ({ selectedOrder }) => {
  return (
    <>
      {/* <pre> {JSON.stringify(selectedOrder, null, 2)}</pre>  */}
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead ></TableHead> */}
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* <pre> {JSON.stringify(selectedOrder, null, 2)}</pre>   */}
          {selectedOrder.items?.map((item) => (
            <>
              <TableRow
                key={item.id}
                className={item.returned == 1 && `bg-red-200 hover:bg-red-300`}
              >
                {/* <TableCell></TableCell> */}
                <TableCell className="">
                  <div className=" w-10 h-10">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={
                          item.productName || item.product?.name || "Product"
                        }
                        className="w-10 h-10 object-cover rounded-md "
                      />
                    ) : null}
                    {/* {JSON.stringify(item)} */}
                    {(!item.product?.image || item.product?.image === "") && (
                      <div className="w-12 h-12 bg-gray-100 rounded-md border flex items-center justify-center">
                        <span className="text-xs text-gray-500 font-medium">
                          {item.productName
                            ? item.productName.charAt(0).toUpperCase()
                            : item.product?.name
                            ? item.product.name.charAt(0).toUpperCase()
                            : "P"}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {item.product?.name.slice(0, 20) || "Product"}...
                    </span>
                    {item.product?.sku && (
                      <span className="text-xs text-gray-500">
                        SKU: {item.product.sku.slice(0, 17) + "."}...
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  LKR {item.product?.sellingPrice?.toFixed(2) || "0.00"}
                </TableCell>
                <TableCell className="text-right">
                  LKR
                  {(item.product?.sellingPrice * item.quantity)?.toFixed(2) ||
                    "0.00"}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colspan={5} className="p-0">
                  <div className="bg-red-200 w-full border-b border-red-400  p-1 flex justify-between items-between">
                    <div className="w-full">
                      {item.returned ? (
                        <Badge className={`text-[8px]  py-0 px-1`}>
                          RETURNED
                        </Badge>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>{item?.id}
                      <Button className={`px-2`} size={'xs'}>RETURN</Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OrderItemTable;
