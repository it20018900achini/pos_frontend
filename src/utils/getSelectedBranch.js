import { useSelector } from "react-redux";


function GetSelectedBranch() {
  const { userProfile } = useSelector((state) => state.user);
  const { selectedBranch } = useSelector((state) => state.branch);
  return userProfile?.user?.defaultBranch || userProfile?.user?.branch || selectedBranch || null;
}
export default GetSelectedBranch;