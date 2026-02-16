"use client";

import { ballTypes, eyeTypes, moduleTypes } from "@/data/qr-designer";
import { useFormContext } from "react-hook-form";

import { SelectorGrid, SelectorItem } from "./SelectorGrid";

export function ModuleFields() {
  const { setValue, watch } = useFormContext();
  const currentModule = watch("design.module") || "square";
  const currentFinder = watch("design.finder") || "default";
  const currentFinderDot = watch("design.finderDot") || "default";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
      <SelectorGrid label="Pattern Style" columns={5}>
        {moduleTypes.map((module) => (
          <SelectorItem
            key={module.id}
            value={module.id}
            label={module.name}
            src={`/images/modules/${module.id}.png`}
            selected={currentModule === module.id}
            onClick={() => setValue("design.module", module.id)}
          />
        ))}
      </SelectorGrid>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-gray-100 dark:border-zinc-900">
        <SelectorGrid label="Finder Outer" columns={3}>
          {eyeTypes.map((eye) => (
            <SelectorItem
              key={eye.id}
              value={eye.id}
              label={eye.name}
              src={`/images/finders/${eye.id}.png`}
              selected={currentFinder === eye.id}
              onClick={() => setValue("design.finder", eye.id)}
            />
          ))}
        </SelectorGrid>

        <SelectorGrid label="Finder Inner" columns={3}>
          {ballTypes.map((ball) => (
            <SelectorItem
              key={ball.id}
              value={ball.id}
              label={ball.name}
              src={`/images/finders/dots/${ball.id}.png`}
              selected={currentFinderDot === ball.id}
              onClick={() => setValue("design.finderDot", ball.id)}
            />
          ))}
        </SelectorGrid>
      </div>
    </div>
  );
}
