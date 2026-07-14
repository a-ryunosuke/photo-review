import { tv } from "tailwind-variants";

export const pageStyle = tv({
    slots: {
        base: "w-full max-w-[480px] mx-auto py-8",
        dropzone: [
            "w-full flex flex-col items-center justify-center",
            "gap-[12px] py-[56px] px-[24px]",
            "border border-dashed border-[var(--border-mid)] rounded-[var(--radius-lg)]",
            "bg-[var(--bg-card)]",
            "cursor-pointer select-none",
            "transition-all duration-200",
            "hover:border-[var(--gold)] hover:bg-[var(--bg-hover)] hover:-translate-y-[2px]"
        ].join(" ")
    },
    variants: {
        isDragging: {
            true: {
                dropzone: [
                    "border-[var(--gold-light)]",
                    "bg-[rgba(201,168,76,0.06)]",
                    "scale-[1.01]",
                    "hover:border-[var(--gold-light)] hover:bg-[rgba(201,168,76,0.06)] hover:translate-y-0 hover:scale-[1.01]"
                ].join(" ")
            }
        }
    }
});