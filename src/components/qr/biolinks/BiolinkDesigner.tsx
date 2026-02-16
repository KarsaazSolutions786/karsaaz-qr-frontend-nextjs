"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Eye, EyeOff, GripVertical, Plus, Settings, Trash2 } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { BlockEditor } from "./BlockEditor";
import { BiolinkBlock, BiolinkBlockType, biolinkBlockDefinitions } from "./types";

export function BiolinkDesigner() {
    const { control } = useFormContext<{ data: { blocks: BiolinkBlock[] } }>();
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "data.blocks",
    });

    const [isPickerOpen, setIsPickerOpen] = React.useState(false);
    const [editingBlockIndex, setEditingBlockIndex] = React.useState<number | null>(null);

    const addBlock = (type: BiolinkBlockType) => {
        append({
            id: Math.random().toString(36).substr(2, 9),
            type,
            content: {},
            settings: { visible: true },
        });
        setIsPickerOpen(false);
        // Open editor for the new block (index is length of fields before append + 0, but fields isn't updated immediately in sync logic sometimes, safe to use fields.length)
        // Actually append update is async in some versions, but usually safe to assume it will be at the end.
        setTimeout(() => setEditingBlockIndex(fields.length), 0); // Hack to wait for update
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Biolink Blocks</h3>
                <Button size="sm" onClick={() => setIsPickerOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Block
                </Button>

                <Dialog open={isPickerOpen} onClose={() => setIsPickerOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Add a Block</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                        {biolinkBlockDefinitions.map((block) => (
                            <button
                                key={block.type}
                                onClick={() => addBlock(block.type)}
                                className="flex flex-col items-center p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center space-y-2 group"
                            >
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100">
                                    <block.icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                                </div>
                                <span className="text-xs font-bold">{block.label}</span>
                                <span className="text-[10px] text-gray-500 line-clamp-1">{block.description}</span>
                            </button>
                        ))}
                    </div>
                </Dialog>
            </div>

            <div className="space-y-3">
                {fields.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-900/50">
                        <p className="text-sm text-gray-500">No blocks added yet. Click "Add Block" to start building your page.</p>
                    </div>
                ) : (
                    fields.map((field, index) => {
                        const block = field as unknown as BiolinkBlock;
                        const def = biolinkBlockDefinitions.find(d => d.type === block.type);

                        return (
                            <Card key={field.id} className="p-4 shadow-sm group">
                                <div className="flex items-center gap-4">
                                    <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
                                        <GripVertical className="h-5 w-5" />
                                    </div>

                                    <div className="h-10 w-10 rounded-md bg-blue-50 flex items-center justify-center">
                                        {def ? <def.icon className="h-5 w-5 text-blue-600" /> : <Settings className="h-5 w-5 text-gray-400" />}
                                    </div>

                                    <div className="flex-1 min-w-0" onClick={() => setEditingBlockIndex(index)}>
                                        <p className="text-sm font-bold truncate cursor-pointer hover:underline">{def?.label || block.type}</p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {JSON.stringify(block.content) === "{}" ? "No content configured" : "Content configured"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                            {block.settings?.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400" onClick={() => setEditingBlockIndex(index)}>
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 hover:text-red-500"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>

            {editingBlockIndex !== null && (
                <BlockEditor
                    blockIndex={editingBlockIndex}
                    onClose={() => setEditingBlockIndex(null)}
                />
            )}
        </div>
    );
}
