import { useState } from "react";
const [toast, setToast] = useState(null);

const showToast = (message, type = "error") => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 4000);
};
