import DiscountSection from "./DiscountSection";
import NoteSection from "./NoteSection";
import PaymentSection from "./PaymentSection";

const CustomerPaymentSection = ({ selectedBranchId, setShowCustomerDialog, setShowPaymentDialog }) => {
  return (
    <div className="w-full flex flex-col bg-card overflow-y-auto">
      <DiscountSection />

      {/* Note Section */}
      <NoteSection />

      {/* Payment Section - Passing the branch ID down */}
      <PaymentSection 
        selectedBranchId={selectedBranchId} 
        setShowPaymentDialog={setShowPaymentDialog} 
      />
    </div>
  );
};

export default CustomerPaymentSection;