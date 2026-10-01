"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

/* -------------------------------------------------
   OVERLAY
------------------------------------------------- */

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[9998]",
      "bg-black/55",
      "backdrop-blur-[2px]",
      "data-[state=open]:animate-in",
      "data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0",
      "data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));

DialogOverlay.displayName =
  DialogPrimitive.Overlay.displayName;

/* -------------------------------------------------
   CONTENT
------------------------------------------------- */

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />

    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-[9999]",
        "w-[calc(100%-2rem)] max-w-lg",
        "-translate-x-1/2 -translate-y-1/2",

        /* SOLID BACKGROUND */
        "bg-white",
        "dark:bg-slate-950",

        /* BORDER + SHADOW */
        "border border-border",
        "rounded-xl",
        "shadow-2xl",

        /* SPACING */
        "p-6",

        /* LAYOUT */
        "grid gap-4",

        /* MOBILE */
        "max-h-[90vh]",
        "overflow-y-auto",

        /* ANIMATION */
        "duration-200",
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95",
        "data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2",
        "data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2",
        "data-[state=open]:slide-in-from-top-[48%]",

        className
      )}
      {...props}
    >
      {children}

      <DialogPrimitive.Close asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-3 top-3",
            "h-8 w-8",
            "rounded-md",
            "text-muted-foreground",
            "opacity-70",
            "hover:bg-muted",
            "hover:text-foreground",
            "hover:opacity-100"
          )}
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));

DialogContent.displayName =
  DialogPrimitive.Content.displayName;

/* -------------------------------------------------
   HEADER
------------------------------------------------- */

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2",
      "text-center sm:text-left",
      className
    )}
    {...props}
  />
);

DialogHeader.displayName = "DialogHeader";

/* -------------------------------------------------
   FOOTER
------------------------------------------------- */

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2",
      "sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
);

DialogFooter.displayName = "DialogFooter";

/* -------------------------------------------------
   TITLE
------------------------------------------------- */

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold",
      "leading-none tracking-tight",
      "text-foreground",
      className
    )}
    {...props}
  />
));

DialogTitle.displayName =
  DialogPrimitive.Title.displayName;

/* -------------------------------------------------
   DESCRIPTION
------------------------------------------------- */

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<
    typeof DialogPrimitive.Description
  >
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground",
      className
    )}
    {...props}
  />
));

DialogDescription.displayName =
  DialogPrimitive.Description.displayName;

/* -------------------------------------------------
   EXPORTS
------------------------------------------------- */

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};