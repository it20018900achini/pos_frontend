import QuotationForm from "../components/quotations/QuotationForm";
import QuotationList from "../components/quotations/QuotationList";

const QuotationsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Quotations</h1>
      <QuotationForm />
      <QuotationList />
    </div>
  );
};

export default QuotationsPage;
