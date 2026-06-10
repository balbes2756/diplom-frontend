import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalStore } from "../../store/useModalStore";
import { loginSchema, type LoginForm } from "../../schemas/login";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import styles from "./LoginModal.module.css";

function LoginModal() {
    const navigate = useNavigate();
    const {
        isLoginOpen,
        pendingPath,
        closeLogin,
        clearPendingPath,
        openRegister,
    } = useModalStore();

    const { login, isLoading } = useAuthStore();

    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        if (isLoginOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            handleClose();
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isLoginOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
            reset();
            closeLogin();
        }, 400);
    };

    // const handleFormSubmit = (data: LoginForm) => {
    //     console.log("Вход:", data);
    //     reset();
    //     handleClose();
    //     if (pendingPath) {
    //         navigate(pendingPath); // ← Переходим на сохранённую страницу
    //         clearPendingPath(); // ← Очищаем путь
    //     }
    // };

    const handleFormSubmit = async (data: LoginForm) => {
        setError(null);

        try {
            // ← Вызываем login из useAuthStore
            await login(data.email, data.password);

            console.log(
                "✅ Login вызван, isAuthenticated:",
                useAuthStore.getState().isAuthenticated,
            );

            handleClose();

            if (pendingPath) {
                navigate(pendingPath);
                clearPendingPath();
            }
        } catch (err) {
            setError("Неверный email или пароль");
            console.error("❌ Ошибка входа:", err);
        }
    };

    const handleSwitchToRegister = (e: React.MouseEvent) => {
        e.preventDefault();
        closeLogin();
        openRegister(pendingPath || undefined);
    };

    if (!isVisible) return null;

    return (
        <div
            className={`${styles.loginPage} ${isClosing ? styles.closing : ""}`}>
            <div className={styles.overlay} onClick={handleClose} />

            <div
                className={`${styles.loginModal} ${isClosing ? styles.modalClosing : ""}`}>
                <button className={styles.closeButton} onClick={handleClose}>
                    ×
                </button>

                <h1 className={styles.title}>войдите в аккаунт</h1>
                <p className={styles.subtitle}>
                    чтобы быстро находить объявления и разные товары
                    <br />и предложения для вас и вашего питомца
                </p>

                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className={styles.form}>
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            placeholder="Введите почту"
                            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                            {...register("email")}
                        />
                        {errors.email && (
                            <span className={styles.errorMessage}>
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Введите пароль"
                                className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.passwordToggle}>
                                {showPassword ? "🗨️" : "👁️"}
                            </button>
                        </div>
                        {errors.password && (
                            <span className={styles.errorMessage}>
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Войти
                    </button>
                </form>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Нет аккаунта?{" "}
                        <a
                            href="#"
                            className={styles.link}
                            onClick={handleSwitchToRegister}>
                            Зарегистрируйтесь
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;
