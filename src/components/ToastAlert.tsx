type ToastType = "error" | "info" | "success";

type Props = {
  type?: ToastType;
  title: string;
  message?: string;
  onClose: () => void;
};

export function ToastAlert({ type = "info", title, message, onClose }: Props) {
  const accent =
    type === "error"
      ? "border-rose-300/25"
      : type === "success"
        ? "border-emerald-300/25"
        : "border-sky-300/25";

  const dot =
    type === "error"
      ? "bg-rose-300"
      : type === "success"
        ? "bg-emerald-300"
        : "bg-sky-300";

  return (
    <div className="fixed right-4 top-4 z-50 w-[320px] max-w-[calc(100vw-2rem)]">
      <div
        className={[
          "rounded-2xl border bg-white/10 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl",
          "transition-all duration-200",
          accent,
        ].join(" ")}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <span className={`mt-1 h-2.5 w-2.5 rounded-full ${dot}`} />

          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-white">{title}</div>
            {message ? (
              <div className="mt-0.5 text-xs text-white/70">{message}</div>
            ) : null}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white/80 hover:bg-white/15"
            type="button"
            aria-label="Fechar alerta"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
