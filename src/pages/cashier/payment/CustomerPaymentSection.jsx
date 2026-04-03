import DiscountSection from "./DiscountSection";
import NoteSection from "./NoteSection";
import PaymentSection from "./PaymentSection";

const CustomerPaymentSection = ({ setShowCustomerDialog, setShowPaymentDialog }) => {
  return (
    <div className="w-full flex flex-col bg-card overflow-y-auto">
      <DiscountSection />

      {/* Note Section */}
      <NoteSection />

      {/* Payment Section */}
      <PaymentSection setShowPaymentDialog={setShowPaymentDialog} />
    </div>
  );
};

export default CustomerPaymentSection;
