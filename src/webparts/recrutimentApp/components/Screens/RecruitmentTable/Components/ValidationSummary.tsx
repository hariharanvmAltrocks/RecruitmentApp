import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, XCircle } from "lucide-react";
import React from "react";
import "../AdvertReviewDrawer/AdvertReviewDrawer.scss"

export interface ValidationMessage {
  key: string;
  text: string;
  valid: boolean;
}

export interface ValidationSummaryProps {
  show: boolean;
  messages: ValidationMessage[];
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({ show, messages }) => {
  const invalidMessages = messages.filter((message) => !message.valid);

  return (
    <AnimatePresence>
      {show && invalidMessages.length > 0 && (
        <motion.div
          className="advert-review-drawer__validation"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
        >
          <div className="advert-review-drawer__validation-header">
            <AlertTriangle size={14} />
            <span>Please fix the following:</span>
          </div>
          {invalidMessages.map((message) => (
            <div key={message.key} className="advert-review-drawer__validation-message">
              <XCircle size={13} />
              <span>{message.text}</span>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
