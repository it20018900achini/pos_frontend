import { useSelector } from "react-redux";
import { selectUnseenCount } from "@/Redux Toolkit/features/presence/chatSlice";

export default function CountIcon({ userId }) {
const myId = useSelector(state => state.auth.user.id);

const unseenCount = useSelector(state =>
  selectUnseenCount(state, myId)
);
  const unseenCount = useSelector(state =>
    selectUnseenCount(state, userId)
  );
    if (!unseenCount || unseenCount <= 0) return null;
    return (
        <span className="ml-2 text-xs bg-red-500 text-white px-2 rounded-full">
            {unseenCount}
        </span>
    );
}
