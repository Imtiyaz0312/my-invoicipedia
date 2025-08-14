"use client";
import { useEffect } from "react";
import { updateStatusAction } from "@/app/actions";

export default function PaymentUpdater({
  invoiceId,
  sessionId,
  status,
}: {
  invoiceId: number;
  sessionId?: string;
  status?: string;
}) {
  useEffect(() => {
    if (status === "success" && sessionId) {
      const formData = new FormData();
      formData.append("id", String(invoiceId));
      formData.append("status", "paid");
      updateStatusAction(formData);
    }
  }, [invoiceId, status, sessionId]);

  return null;
}
