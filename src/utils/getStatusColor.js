export const getStatusColor = (status) => {
  if (!status) return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";

  switch (status.toLowerCase()) {
    case "completed":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80";
    case "processing":
      return "bg-primary/10 text-primary hover:bg-primary/20";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
    case "refunded":
      return "bg-red-100 text-red-800 hover:bg-red-100/80";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
  }
};