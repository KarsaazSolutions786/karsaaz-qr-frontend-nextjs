"use client";

import { BiolinkDesigner } from "@/components/qr/biolinks/BiolinkDesigner";
import { QRFormBuilder } from "@/components/qr/QRFormBuilder";
import { QRPreview } from "@/components/qr/QRPreview";
import { StepIndicator } from "@/components/qr/StepIndicator";
import { Button } from "@/components/ui/button";
import { getFieldsForType } from "@/data/qr-type-fields";
import { allQRTypes } from "@/data/qr-types";
import { useQRSteps } from "@/hooks/use-qr-steps";
import { qrCodeService } from "@/services/qr.service";
import { ArrowLeft, ArrowRight, FileText, Loader2, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateSpecificQRPage() {
  const params = useParams();
  const router = useRouter();
  const typeId = params.type as string;
  const typeInfo = allQRTypes.find(t => t.id === typeId);
  const fields = getFieldsForType(typeId);
  const { currentStep, steps, nextStep, prevStep } = useQRSteps();

  const methods = useForm({
    defaultValues: {
      design: {
        fillType: "solid",
        foregroundColor: "#000000",
        eyeInternalColor: "#000000",
        eyeExternalColor: "#000000",
        backgroundColor: "#ffffff",
        backgroundEnabled: true,
        gradientFill: { type: "RADIAL", colors: ["#000000", "#1c57cb"], rotation: 0 },
        foregroundImage: null,
        module: "square",
        finder: "default",
        finderDot: "default",
        shape: "none",
        frameColor: "#000000",
        logoScale: 0.2,
        logoPositionX: 0.5,
        logoPositionY: 0.5,
        logoRotate: 0,
        logoBackground: true,
        logoBackgroundFill: "#ffffff",
        logoBackgroundShape: "circle",
        logoBackgroundScale: 1.5,
        logoType: "none",
        advancedShape: "none",
        advancedShapeDropShadow: true,
        advancedShapeFrameColor: "#000000",
        // Text Properties
        text: "SCAN ME",
        textColor: "#ffffff",
        textBackgroundColor: "#000000",
        fontFamily: "Inter",
        fontVariant: "700",
        textSize: "1",
        // Specialized Sticker Defaults
        healthcareFrameColor: "#CC0032",
        healthcareHeartColor: "#ffffff",
        couponLeftColor: "#000000",
        couponRightColor: "#CC0032",
        coupon_text_line_1text: "EXCLUSIVE",
        coupon_text_line_2text: "OFFER",
        coupon_text_line_3text: "50% OFF",
        reviewCollectorCircleColor: "#000000",
        reviewCollectorStarsColor: "#FFD700",
        reviewCollectorLogoSrc: "google",
        // AI Properties
        is_ai: false,
        ai_strength: 1.8,
        ai_steps: 18,
        ai_model: "1.1",
      },
      type: typeId,
      logoFile: null,
      ...fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
    }
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      const { design, logoFile, ...qrData } = data;

      // 1. Create the QR Code
      const payload = {
        name: `${typeInfo?.name || "QR"} - ${new Date().toLocaleDateString()}`,
        type: typeId,
        data: qrData as Record<string, unknown>,
        design: design as Record<string, unknown>
      };

      const qrCode = await qrCodeService.create(payload);

      if (qrCode?.id) {
        toast.success("Content saved! Let&apos;s style your QR.");
        // Redirect to Edit page Step 2
        router.push(`/dashboard/qrcodes/edit/${qrCode.id}?step=design`);
      }
    } catch (error: unknown) {
      console.error(error);
      const message = (error as { jsonResponse?: { message?: string } })?.jsonResponse?.message || "Failed to create QR code";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: unknown) => {
    console.error("Form Validation Errors:", errors);
    toast.error("Please fill in all required fields correctly.");
  };

  if (!typeInfo) return <div className="p-20 text-center font-bold uppercase tracking-widest text-red-500">Invalid QR Type</div>;

  return (
    <FormProvider {...methods}>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 bg-background/80 backdrop-blur-md py-4 border-b">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" type="button" onClick={() => router.back()} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase flex items-center gap-2">
                {typeInfo.name} <Sparkles className="h-4 w-4 text-blue-600" />
              </h1>
              <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em]">Step 1: Configuration & Content</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" type="button" className="uppercase font-black text-[10px] tracking-[0.2em] h-11 px-6 rounded-xl border-2" onClick={() => router.back()}>Cancel</Button>
            <Button 
              onClick={methods.handleSubmit(onSubmit, onInvalid)} 
              disabled={isSubmitting} 
              className="uppercase font-black text-[10px] tracking-[0.2em] h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none transition-all hover:scale-105 active:scale-95 group"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <>Style Design <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
            </Button>
          </div>
        </div>

        <StepIndicator currentStep={currentStep} steps={steps} />

        <div className="flex justify-center">
          <div className="w-full max-w-3xl space-y-8">
            <div className="bg-card shadow-sm overflow-hidden rounded-[2.5rem] ring-1 ring-gray-200 dark:ring-zinc-800 p-8 sm:p-10 space-y-10">
              <div className="flex items-center gap-4 border-b border-dashed pb-6">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-black uppercase tracking-tight text-lg">QR Source Data</h2>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Input your content and metadata below</p>
                </div>
              </div>

              <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                {typeId === "biolinks" ? <BiolinkDesigner /> : <QRFormBuilder fields={fields} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
