import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Chatbot } from "../chat/Chatbot";

export const Layout = ({ children }) => {
  return (<div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-16 lg:pt-20">
      {children}
    </main>
    <Footer />
    <Chatbot />
  </div>);
};
