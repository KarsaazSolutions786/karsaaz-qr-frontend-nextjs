"use client";

import React from "react";
import { QRFormBuilder, FieldDefinition } from "../../QRFormBuilder";

const vCardFields: FieldDefinition[] = [
  { name: "firstName", label: "First Name", type: "text", required: true, className: "w-1/2 inline-block pr-2" },
  { name: "lastName", label: "Last Name", type: "text", required: true, className: "w-1/2 inline-block pl-2" },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "company", label: "Company", type: "text" },
  { name: "jobTitle", label: "Job Title", type: "text" },
  { name: "website", label: "Website", type: "url" },
  { name: "address", label: "Address", type: "textarea" },
];

export function VCardForm() {
  return <QRFormBuilder fields={vCardFields} />;
}
