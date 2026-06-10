import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "../../store/useModalStore";
import {
    step1Schema,
    step2Schema,
    step3Schema,
} from "../../schemas/registerSteps";
import { useAuthStore } from "../../store/useAuthStore";
import styles from "./RegisterModal.module.css";

type Step1Form = z.infer<typeof step1Schema>;
type Step2Form = z.infer<typeof step2Schema>;
type Step3Form = z.infer<typeof step3Schema>;

function RegisterModal() {
    const navigate = useNavigate();

    // === ПОЛУЧАЕМ ДАННЫЕ ИЗ СТОРА ===
    const {
        isRegisterOpen, // Открыта ли модалка
        pendingPath, // Куда перейти после закрытия
        currentStep,
        closeRegister, // Функция закрытия
        clearPendingPath,
        setStep,
        resetSteps,
        openLogin, // Функция очистки пути
    } = useModalStore();

    // ← Получаем весь store целиком
    const authStore = useAuthStore();
    const registerAuth = authStore.register;
    // const isAuthLoading = useAuthStore();

    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // ← Храним данные формы
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        phone: "",
    });

    const {
        register: registerStep1,
        handleSubmit: handleSubmitStep1,
        formState: { errors: errorsStep1 },
        reset: resetStep1,
    } = useForm<Step1Form>({
        resolver: zodResolver(step1Schema),
        defaultValues: { email: "" },
    });

    const {
        register: registerStep2,
        handleSubmit: handleSubmitStep2,
        formState: { errors: errorsStep2 },
        reset: resetStep2,
    } = useForm<Step2Form>({
        resolver: zodResolver(step2Schema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const {
        register: registerStep3,
        handleSubmit: handleSubmitStep3,
        formState: { errors: errorsStep3 },
        reset: resetStep3,
    } = useForm<Step3Form>({
        resolver: zodResolver(step3Schema),
        defaultValues: { name: "", phone: "" },
    });

    // === ЗАКРЫТИЕ МОДАЛКИ ===
    const handleClose = () => {
        setIsClosing(true);

        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);

            setIsSubmitting(false);

            // ← Очищаем все формы
            resetStep1({ email: "" });
            resetStep2({ password: "", confirmPassword: "" });
            resetStep3({ name: "", phone: "" });
            resetSteps();

            closeRegister(); // ← Вызываем функцию из стора
        }, 400); // Ждём окончания анимации
    };

    // === ОТКРЫТИЕ МОДАЛКИ ===
    useEffect(() => {
        if (isRegisterOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden"; // Блокируем скролл
        } else {
            handleClose();
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isRegisterOpen]); // ← Срабатывает когда isRegisterOpen меняется

    const goToNextStep = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setStep(currentStep + 1);
            setIsAnimating(false);
        }, 300);
    };

    const goToPrevStep = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setStep(currentStep - 1);
            setIsAnimating(false);
        }, 300);
    };

    const onStep1Submit = (data: Step1Form) => {
        setFormData((prev) => ({ ...prev, email: data.email }));
        goToNextStep();
    };

    const onStep2Submit = (data: Step2Form) => {
        setFormData((prev) => ({ ...prev, password: data.password }));
        goToNextStep();
    };

    const onStep3Submit = async (data: Step3Form) => {
        setIsSubmitting(true);
        const fullData = {
            ...formData,
            name: data.name,
            phone: data.phone ?? "",
        };

        setFormData(fullData);

        try {
            await registerAuth(
                fullData.email,
                fullData.password,
                fullData.name,
                fullData.phone,
            );

            console.log("✅ Регистрация завершена, пользователь авторизован");

            // Закрываем модалку и переходим
            handleClose();

            if (pendingPath) {
                navigate(pendingPath);
                clearPendingPath();
            }
        } catch (error) {
            console.error("❌ Ошибка регистрации:", error);
            alert("Ошибка регистрации. Попробуйте ещё раз.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSwitchToLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        closeRegister();
        openLogin(pendingPath || undefined); // ← Используем openLogin
    };

    // Если модалка не видима — не рендерим (для производительности)
    if (!isVisible) return null;

    return (
        <div
            className={`${styles.registerPage} ${isClosing ? styles.closing : ""}`}>
            <div className={styles.overlay} onClick={handleClose} />

            <div
                className={`${styles.registerModal} ${isClosing ? styles.modalClosing : ""}`}>
                <button className={styles.closeButton} onClick={handleClose}>
                    ×
                </button>

                <div className={styles.stepIndicator}>
                    <span
                        className={`${styles.step} ${currentStep >= 1 ? styles.active : ""}`}>
                        1/3
                    </span>
                    <span className={styles.stepDivider}>→</span>
                    <span
                        className={`${styles.step} ${currentStep >= 2 ? styles.active : ""}`}>
                        2/3
                    </span>
                    <span className={styles.stepDivider}>→</span>
                    <span
                        className={`${styles.step} ${currentStep >= 3 ? styles.active : ""}`}>
                        3/3
                    </span>
                </div>

                <h1 className={styles.title}>создайте аккаунт</h1>
                <p className={styles.subtitle}>
                    чтобы быстро находить объявления и разные товары
                    <br />и предложения для вас и вашего питомца
                </p>

                {/* ШАГ 1: Email */}
                {currentStep === 1 && (
                    <form
                        onSubmit={handleSubmitStep1(onStep1Submit)}
                        className={`${styles.form} ${isAnimating ? styles.animating : ""}`}>
                        <div className={styles.formGroup}>
                            <input
                                type="email"
                                placeholder="Введите почту"
                                className={`${styles.input} ${errorsStep1.email ? styles.inputError : ""}`}
                                {...registerStep1("email")}
                                disabled={isSubmitting}
                            />
                            {errorsStep1.email && (
                                <span className={styles.errorMessage}>
                                    {errorsStep1.email.message}
                                </span>
                            )}
                        </div>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}>
                            Продолжить
                        </button>
                    </form>
                )}

                {/* ШАГ 2: Пароль */}
                {currentStep === 2 && (
                    <form
                        onSubmit={handleSubmitStep2(onStep2Submit)}
                        className={`${styles.form} ${isAnimating ? styles.animating : ""}`}>
                        <div className={styles.formGroup}>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Придумайте пароль"
                                    className={`${styles.input} ${errorsStep2.password ? styles.inputError : ""}`}
                                    {...registerStep2("password")}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className={styles.passwordToggle}>
                                    {showPassword ? "🗨️" : "👁️"}
                                </button>
                            </div>

                            {errorsStep2.password && (
                                <span className={styles.errorMessage}>
                                    {errorsStep2.password.message}
                                </span>
                            )}
                        </div>
                        <div className={styles.formGroup}>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Повторите пароль"
                                    className={`${styles.input} ${errorsStep2.confirmPassword ? styles.inputError : ""}`}
                                    {...registerStep2("confirmPassword")}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className={styles.passwordToggle}>
                                    {showPassword ? "🗨️" : "👁️"}
                                </button>
                            </div>

                            {errorsStep2.confirmPassword && (
                                <span className={styles.errorMessage}>
                                    {errorsStep2.confirmPassword.message}
                                </span>
                            )}
                        </div>
                        <div className={styles.buttonGroup}>
                            <button
                                type="button"
                                className={styles.backButton}
                                onClick={goToPrevStep}
                                disabled={isSubmitting}>
                                ← Назад
                            </button>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}>
                                Продолжить
                            </button>
                        </div>
                    </form>
                )}

                {/* ШАГ 3: Имя и телефон */}
                {currentStep === 3 && (
                    <form
                        onSubmit={handleSubmitStep3(onStep3Submit)}
                        className={`${styles.form} ${isAnimating ? styles.animating : ""}`}>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                placeholder="Ваше имя"
                                className={`${styles.input} ${errorsStep3.name ? styles.inputError : ""}`}
                                {...registerStep3("name")}
                                disabled={isSubmitting}
                                autoFocus
                            />
                            {errorsStep3.name && (
                                <span className={styles.errorMessage}>
                                    {errorsStep3.name.message}
                                </span>
                            )}
                        </div>
                        <div className={styles.formGroup}>
                            <input
                                type="tel"
                                placeholder="Номер телефона (необязательно)"
                                className={`${styles.input} ${errorsStep3.phone ? styles.inputError : ""}`}
                                {...registerStep3("phone")}
                                disabled={isSubmitting}
                            />
                            {errorsStep3.phone && (
                                <span className={styles.errorMessage}>
                                    {errorsStep3.phone.message}
                                </span>
                            )}
                        </div>
                        <div className={styles.buttonGroup}>
                            <button
                                type="button"
                                className={styles.backButton}
                                onClick={goToPrevStep}
                                disabled={isSubmitting}>
                                ← Назад
                            </button>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}>
                                {isSubmitting
                                    ? "Регистрация..."
                                    : "Зарегистрироваться"}
                            </button>
                        </div>
                    </form>
                )}

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Уже есть аккаунт?{" "}
                        <a
                            href="#"
                            className={styles.link}
                            onClick={handleSwitchToLogin}>
                            Войдите
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterModal;
