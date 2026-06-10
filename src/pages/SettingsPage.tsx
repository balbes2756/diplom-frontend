import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "../lib/api";
import styles from "./SettingsPage.module.css";

const schema = z.object({
    name: z.string().min(1, "Имя обязательно"),
    phone: z.string().optional(),
    avatar: z
        .string()
        .url("Введите корректный URL")
        .optional()
        .or(z.literal("")),
});

type SettingsForm = z.infer<typeof schema>;

function SettingsPage() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<SettingsForm>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: user?.name || "",
            phone: user?.phone || "",
            avatar: user?.avatar || "",
        },
    });

    const avatarValue = watch("avatar");
    // const nameValue = watch("name");
    const phoneValue = watch("phone");

    const handleRemoveAvatar = () => {
        setValue("avatar", "", { shouldDirty: true, shouldTouch: true });
    };
    const handleRemovePhone = () => {
        setValue("phone", "", { shouldDirty: true, shouldTouch: true });
    };

    const onSubmit = async (data: SettingsForm) => {
        setIsLoading(true);
        setStatus("idle");
        try {
            // Убираем пустые строки, чтобы бэкенд не перезаписывал null на ""
            const payload = Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key,
                    value === "" ? null : value,
                ]),
            );

            const updated = await api.patch<typeof user>("/users/me", payload);
            updateUser(updated!);
            setStatus("success");
            setMessage("Профиль успешно обновлён");
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message || "Ошибка сохранения");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <button
                className={styles.backButton}
                onClick={() => navigate("/profile")}>
                ← Назад в профиль
            </button>

            <div className={styles.card}>
                <h1 className={styles.title}>Настройки профиля</h1>
                <p className={styles.subtitle}>
                    Управляйте личными данными и отображением
                </p>

                {status === "success" && (
                    <div className={`${styles.alert} ${styles.alertSuccess}`}>
                        ✅ {message}
                    </div>
                )}
                {status === "error" && (
                    <div className={`${styles.alert} ${styles.alertError}`}>
                        ⚠️ {message}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {/* Имя */}
                    <div className={styles.field}>
                        <label className={styles.label}>Имя</label>
                        <input
                            type="text"
                            {...register("name")}
                            className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                            disabled={isLoading}
                        />
                        {errors.name && (
                            <span className={styles.error}>
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    {/* Телефон */}
                    <div className={styles.field}>
                        <label className={styles.label}>Телефон</label>
                        <input
                            type="tel"
                            placeholder="+7 (999) 000-00-00"
                            {...register("phone")}
                            className={styles.input}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={handleRemovePhone}
                            disabled={!phoneValue || isLoading}>
                            Очистить
                        </button>
                    </div>

                    {/* Аватар (пока URL) */}
                    <div className={styles.field}>
                        <label className={styles.label}>Ссылка на аватар</label>
                        <input
                            type="url"
                            placeholder="https://example.com/photo.jpg"
                            {...register("avatar")}
                            className={`${styles.input} ${errors.avatar ? styles.inputError : ""}`}
                            disabled={isLoading}
                        />
                        {errors.avatar && (
                            <span className={styles.error}>
                                {errors.avatar.message}
                            </span>
                        )}
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={handleRemoveAvatar}
                            disabled={!avatarValue || isLoading}>
                            Очистить
                        </button>
                        <span className={styles.hint}>
                            Временно: вставьте прямую ссылку на изображение
                        </span>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.secondaryBtn}
                            onClick={() => reset()}
                            disabled={isLoading}>
                            Сбросить
                        </button>
                        <button
                            type="submit"
                            className={styles.primaryBtn}
                            disabled={isLoading}>
                            {isLoading
                                ? "Сохранение..."
                                : "Сохранить изменения"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SettingsPage;
