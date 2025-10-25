"use client";

import "@/styles/globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Nav from "@/components/Nav";
import Provider from "@/components/Provider";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function WebsiteLayout({ children }: { children: any }) {
  const pathname = usePathname();
  const isEmployeePage = pathname?.startsWith('/employee');

  return (
    <html lang="ar" dir="rtl">
      <body>
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
          {isEmployeePage ? (
            // Employee pages - no Nav, Footer, or gradient
            children
          ) : (
            // Regular pages with full layout
            <>
              {/* Background gradient for main website */}
              <div className="main">
                <div className="gradient" />
              </div>

              {/* Main website content */}
              <main className="app">
                <Nav />
                {children}
              </main>
              
              <Footer />
            </>
          )}
        </Provider>
      </body>
    </html>
  );
}
