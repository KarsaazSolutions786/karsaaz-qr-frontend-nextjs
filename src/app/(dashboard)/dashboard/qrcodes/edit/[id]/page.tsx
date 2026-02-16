"use client";

import { ArrowRight, Check, ChevronLeft, FileText, History, Loader2, Palette, Save, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { QRDesigner } from "@/components/qr/QRDesigner";
import { QRDownload } from "@/components/qr/QRDownload";
import { QRFormBuilder } from "@/components/qr/QRFormBuilder";
import { QRPreview } from "@/components/qr/QRPreview";
import { StepIndicator } from "@/components/qr/StepIndicator";
import { Button } from "@/components/ui/button";
import { getFieldsForType } from "@/data/qr-type-fields";
import { allQRTypes } from "@/data/qr-types";
import { useQRSteps } from "@/hooks/use-qr-steps";
import { cn } from "@/lib/utils";
import { QRCode, qrCodeService } from "@/services/qr.service";

export default function EditQRCodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { currentStep, steps, nextStep, prevStep, setStep, isLastStep } = useQRSteps();

  const [qrcode, setQrcode] = useState<QRCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm();
  const { reset, handleSubmit, register } = methods;

  const fetchQRCode = useCallback(async () => {
    try {
      const data = await qrCodeService.getOne(id);
      setQrcode(data);

      reset({
        ...data.data,
        id: data.id,
        name: data.name,
        type: data.type,
        design: {
          ...data.design,
          fillType: data.design?.fillType || "solid",
          foregroundColor: data.design?.foregroundColor || "#000000",
          backgroundColor: data.design?.backgroundColor || "#ffffff",
          eyeInternalColor: data.design?.eyeInternalColor || "#000000",
          eyeExternalColor: data.design?.eyeExternalColor || "#000000",
          module: data.design?.module || "square",
          finder: data.design?.finder || "default",
          finderDot: data.design?.finderDot || "default",
          logoScale: data.design?.logoScale ?? 0.2,
          logoBackground: data.design?.logoBackground ?? true,
          logoBackgroundShape: data.design?.logoBackgroundShape || "circle",
          logoBackgroundScale: data.design?.logoBackgroundScale ?? 1,
          advancedShape: data.design?.advancedShape || "none",
          advancedShapeFrameColor: data.design?.advancedShapeFrameColor || "#000000",
        }
      });
    } catch (error: unknown) {
      console.error("Failed to fetch QR code", error);
      toast.error("Failed to load QR code data");
    } finally {
      setLoading(false);
    }
  }, [id, reset]); // Add reset to dependencies

  useEffect(() => {
    fetchQRCode();
  }, [fetchQRCode]);

  const onNext = useCallback(async (formData: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      const { design, name, type, id: _id, ...qrData } = formData; // Renamed 'id' to '_id' to mark as unused

      await qrCodeService.update(id, {
        name: name as string,
        type: type as string,
        data: qrData as Record<string, unknown>,
        design: design as Record<string, unknown>
      });

      if (isLastStep) {
        toast.success("QR Code finalized successfully");
        router.push("/dashboard/qrcodes");
      } else {
        toast.success("Changes saved");
        nextStep();
      }
    } catch (error: unknown) {
      console.error(error);
      const message = (error as { jsonResponse?: { message?: string } })?.jsonResponse?.message || "Failed to update QR code";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [id, isLastStep, router, nextStep]); // Add dependencies

  const onInvalid = useCallback((errors: unknown) => {
    console.error("Form Validation Errors:", errors);
    toast.error("Please fill in all required fields correctly.");
  }, []); // No dependencies

  const handleSaveOnly = useCallback(async () => {
    const formData = methods.getValues();
    setIsSubmitting(true);
    try {
      const { design, name, type, id: _id, ...qrData } = formData; // Renamed 'id' to '_id'
      await qrCodeService.update(id, {
        name,
        type,
        data: qrData,
        design
      });
      toast.success("Saved successfully");
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError?.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  }, [id, methods]); // Add methods to dependencies

  const handleDelete = useCallback(async () => {
    if (confirm("Are you sure you want to delete this QR code?")) {
      try {
        await qrCodeService.delete(id);
        toast.success("QR Code deleted");
        router.push("/dashboard/qrcodes");
      } catch (e: unknown) {
        const apiError = e as { message?: string };
        toast.error(apiError?.message || "Failed to delete QR code");
      }
    }
  }, [id, router]); // Add id, router to dependencies

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!qrcode) {
    return (
      <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-2 border-dashed">
        <h2 className="text-xl font-black uppercase tracking-tight">QR Code Not Found</h2>
        <p className="text-sm text-muted-foreground mt-2 uppercase font-bold tracking-widest">The record might have been deleted or moved.</p>
        <Button variant="link" asChild className="mt-4 font-black uppercase tracking-widest text-xs">
          <Link href="/dashboard/qrcodes">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const typeInfo = allQRTypes.find(t => t.id === qrcode.type);
  const fields = getFieldsForType(qrcode.type);

  return (
    <FormProvider {...methods}>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 bg-background/80 backdrop-blur-md py-4 border-b">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" type="button" onClick={prevStep} className="rounded-xl">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase flex items-center gap-2">
                {qrcode.name} <Sparkles className="h-4 w-4 text-blue-600" />
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100">{typeInfo?.name}</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  Step {steps.indexOf(currentStep) + 1} of 3: {currentStep}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={handleDelete} className="text-red-600 border-2 border-red-100 hover:bg-red-50 hover:text-red-700 h-11 px-4 rounded-xl transition-all">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleSaveOnly}
              disabled={isSubmitting}
              className="uppercase font-black text-[10px] tracking-[0.2em] h-11 px-6 rounded-xl border-2 hidden sm:flex"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Save</>}
            </Button>
            <Button
              onClick={handleSubmit(onNext, onInvalid)}
              disabled={isSubmitting}
              className="uppercase font-black text-[10px] tracking-[0.2em] h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none transition-all hover:scale-105 active:scale-95 group"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isLastStep ? (
                <><Check className="mr-2 h-4 w-4" /> Finish</>
              ) : (
                <>{currentStep === 'content' ? 'Next: Design' : 'Next: Download'} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </div>
        </div>

        <StepIndicator currentStep={currentStep} steps={steps} />

        <div className={cn(
          "grid gap-12",
          currentStep === 'content' ? "flex justify-center" : "grid-cols-1 lg:grid-cols-12"
        )}>
          <div className={cn(
            "space-y-8",
            currentStep === 'content' ? "w-full max-w-3xl" : "lg:col-span-7"
          )}>
            <div className="bg-card shadow-sm overflow-hidden rounded-[2.5rem] ring-1 ring-gray-200 dark:ring-zinc-800 p-8 sm:p-10 min-h-[500px]">
              {currentStep === 'content' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="flex items-center gap-4 border-b border-dashed pb-6">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-black uppercase tracking-tight text-lg">Configuration & Content</h2>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Update your QR data and internal metadata</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Internal Reference Name</label>
                      <input
                        {...register("name")}
                        className="w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all shadow-sm"
                        placeholder="e.g. Summer Campaign 2024"
                      />
                    </div>
                    <div className="pt-4 border-t border-dashed">
                      <QRFormBuilder fields={fields} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'design' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-4 border-b border-dashed pb-6">
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-2xl text-purple-600 dark:text-purple-400">
                      <Palette className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-black uppercase tracking-tight text-lg">Aesthetic Customization</h2>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Design your unique high-fidelity QR look</p>
                    </div>
                  </div>
                  <QRDesigner />
                </div>
              )}

              {currentStep === 'download' && (
                <QRDownload />
              )}
            </div>

            <div className="mt-8 p-6 bg-muted/20 rounded-[2rem] border-2 border-dashed flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-black text-muted-foreground uppercase tracking-widest">
                <History className="h-5 w-5 opacity-50" />
                History & Quick Actions
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest rounded-lg"><History className="h-3.5 w-3.5 mr-2" /> Restore Version</Button>
              </div>
            </div>
          </div>

          {currentStep !== 'content' && (
            <div className="lg:col-span-5">
              <QRPreview id={id} loading={isSubmitting} />
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
