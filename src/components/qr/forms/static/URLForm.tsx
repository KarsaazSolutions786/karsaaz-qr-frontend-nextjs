"use client";

import React from "react";
import { QRFormBuilder, FieldDefinition } from "../../QRFormBuilder";

const urlFields: FieldDefinition[] = [
  {
    name: "url",
    label: "Website URL",
    type: "url",
    placeholder: "https://example.com",
    required: true,
  },
];

export function URLForm() {
  return <QRFormBuilder fields={urlFields} />;
}
