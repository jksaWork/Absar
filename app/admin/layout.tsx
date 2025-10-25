import "@/styles/globals.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Provider from "@/components/Provider";

export const metadata = {
  title: "لوحة الإدارة - ابصار للبصريات",
  description: "لوحة إدارة مركز البصريات",
};

const AdminLayout = ({ children }: { children: any }) => (
  <div className="min-h-screen bg-gray-50">
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={true}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <Provider session={null}>
      {children}
    </Provider>
  </div>
);

export default AdminLayout;
