import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import ChatBox from "./ChatBox";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mb-3 w-[90vw] max-w-[600px] h-[75vh] sm:h-[750px] shadow-2xl border border-gray-200 dark:border-gray-700  bg-white dark:bg-gray-900 overflow-hidden"
          >
            <ChatBox />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className={`transition-all duration-200 flex items-center justify-center w-14 h-14 rounded-full shadow-lg 
        ${open ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
        aria-label="Toggle Chat"
      >
        {open ? <X size={26} /> : <MessageSquare size={26} />}
      </button>
    </div>
  );
}






// // src/components/ChatWidget.jsx
// import { useState } from "react";
// import { MessageSquare } from "lucide-react"; // Or use any other icon
// import ChatBox from "./ChatBox";

// export default function ChatWidget() {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       {open && (
//         <div className="mb-2 w-[550px] h-[800px] shadow-xl border border-gray-300 rounded-lg bg-white dark:bg-gray-900">
//           <ChatBox />
//         </div>
//       )}
//       <button
//         onClick={() => setOpen(!open)}
//         className="bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700"
//       >
//         <MessageSquare size={24} />
//       </button>
//     </div>
//   );
// }
