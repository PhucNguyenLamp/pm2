
export default function ErrorState({ message = "Lỗi khi tải dữ liệu", onRetry }) {
    return (
        <div className="text-center py-10 text-red-500">
            <p className="text-xl font-semibold">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-4 bg-secondary text-white px-4 py-2 rounded"
                >
                    Thử lại
                </button>
            )}
        </div>
    );
}
