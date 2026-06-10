import { useToastStore } from "../../store/useToastStore";
import styles from "./Toast.module.css";

export default function ToastContainer() {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className={styles.container}>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${styles.toast} ${styles[toast.type]}`}
                    onClick={() => removeToast(toast.id)}>
                    {toast.type === "success" && "✅ "}
                    {toast.type === "error" && "❌ "}
                    {toast.type === "info" && "ℹ️ "}
                    {toast.message}
                </div>
            ))}
        </div>
    );
}
