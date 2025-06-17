
import { useNotificationStore } from "@/store/useUserStore";
import { FaBell } from "react-icons/fa"; // Using react-icons for better control

const NotificationBell = () => {
  const { notifications } = useNotificationStore();

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
      }}
      title="Notifications"
    >
      {/* <FaBell size={24} color="#50394c" />  */}
      {/* Bell icon with custom size and color */}

      {notifications.length > 0 && (
        <span
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "3px 7px",
            fontSize: "12px",
            fontWeight: "bold",
            boxShadow: "0 0 5px rgba(0,0,0,0.3)",
            animation: "ping 1s infinite",
          }}
        >
          {notifications.length}
        </span>
      )}

      <style jsx>{`
        @keyframes ping {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
