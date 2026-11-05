interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({
  message = "Không có dữ liệu",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
        />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  );
}
