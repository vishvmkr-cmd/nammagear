'use client';

export function AdminErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border-[0.5px] border-rose/40 bg-rose-soft p-5 mb-6 text-[13px]">
      <p className="font-medium text-ink mb-1">Couldn’t load this data</p>
      <p className="text-muted leading-relaxed mb-3">{message}</p>
      <p className="text-[12px] text-muted leading-relaxed mb-3">
        Promoted to admin? Log out and log in again so your cookie gets a fresh token. Ensure the API is running and you have restarted Next after changing <span className="font-mono text-[11px]">next.config</span>.
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="font-mono text-[11px] tracking-[0.08em] uppercase py-2 px-4 rounded-xl bg-ink text-bg border-0 cursor-pointer hover:opacity-90"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
