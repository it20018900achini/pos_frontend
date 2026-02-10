import ContentLayout from "../../Dashboard/ContentLayout";
import QuotationForm from "../components/quotations/QuotationForm";
import QuotationList from "../components/quotations/QuotationList";

const QuotationsPage = () => {
  return (
    <ContentLayout title="Quotations" subTitle="Manage your sales quotations here. Create, view, and track all your quotations in one place.">
       <div className="p-6 space-y-6">
      <QuotationForm />
      <QuotationList />
    </div>
    </ContentLayout>
    
  );
};

export default QuotationsPage;
