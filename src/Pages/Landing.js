import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBrain, FaDatabase, FaFacebookF, FaHeartbeat, FaInstagram, FaLaptopMedical, FaStethoscope } from 'react-icons/fa';
import '../css/landing.css';

function Reveal({ children, className = '', delay = 0 }) {
    const reduceMotion = useReducedMotion();
    const hiddenVariant = reduceMotion
        ? { opacity: 0, y: 10 }
        : { opacity: 0, y: 36, scale: 0.98 };
    const visibleVariant = { opacity: 1, y: 0, scale: 1 };

    return (
        <motion.div
            className={className}
            initial={hiddenVariant}
            whileInView={visibleVariant}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: reduceMotion ? 0.35 : 0.7, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

function HeroReveal({ children, className = '', delay = 0 }) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            className={className}
            initial={reduceMotion ? { opacity: 0, y: 8 } : { opacity: 0, y: 42, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0.35 : 0.8, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

function SectionEyebrow({ children }) {
    return <span className="landing-eyebrow">{children}</span>;
}

function ProcessCard({ icon, title, description, meta, disableHover = false }) {
    return (
        <motion.article
            className="landing-process-card"
            whileHover={disableHover ? undefined : { y: -8, scale: 1.02 }}
            transition={disableHover ? undefined : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="landing-process-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            <span>{meta}</span>
        </motion.article>
    );
}

function SocialLinkCard({ href, label, icon, description, disableHover = false }) {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="landing-social-card"
            whileHover={disableHover ? undefined : { y: -5, scale: 1.01 }}
            transition={disableHover ? undefined : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="landing-social-icon">{icon}</div>
            <div>
                <strong>{label}</strong>
                <p>{description}</p>
            </div>
        </motion.a>
    );
}

function Landing() {
    const reduceMotion = useReducedMotion();
    const [isLowPerf, setIsLowPerf] = useState(false);
    const [screeningState, setScreeningState] = useState('idle');
    const [resultText, setResultText] = useState('Simulación lista para mostrar una probabilidad orientativa en menos de 5 minutos.');
    const timeoutRef = useRef(null);
    const logoSrc = `${process.env.PUBLIC_URL}/Logo.png`;

    const blobs = [
        {
            className: 'landing-blob-one',
            animate: { x: [0, 60, -25, 45, 0], y: [0, -30, 30, -20, 0], scale: [1, 1.08, 0.92, 1.04, 1] },
            duration: 24,
        },
        {
            className: 'landing-blob-two',
            animate: { x: [0, -70, 35, -15, 0], y: [0, 40, -25, 35, 0], scale: [1, 0.9, 1.05, 0.95, 1] },
            duration: 30,
        },
        {
            className: 'landing-blob-three',
            animate: { x: [0, 25, -45, 30, 0], y: [0, -40, 15, -15, 0], scale: [1, 1.12, 0.94, 1.02, 1] },
            duration: 27,
        },
    ];

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;
        const lowCpu = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;

        setIsLowPerf(coarsePointer || reduced || lowMemory || lowCpu);
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const performanceMode = reduceMotion || isLowPerf;

    const handleScreeningDemo = () => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }

        setScreeningState('processing');
        setResultText('Procesando variables clínicas con un flujo de tamizaje académico...');

        timeoutRef.current = window.setTimeout(() => {
            setScreeningState('success');
            setResultText('Resultado estimado: riesgo moderado detectado. Se recomienda evaluación médica y seguimiento preventivo.');
        }, 2800);
    };


    const processSteps = [
        {
            icon: <FaDatabase />,
            title: '1. Carga de Datos',
            description: 'El usuario registra variables relevantes para el tamizaje de Diabetes Tipo 2 dentro de una interfaz accesible y guiada.',
            meta: 'Datos estructurados y listos para análisis',
            cardClass: 'bento-span-5 is-data',
        },
        {
            icon: <FaBrain />,
            title: '2. Procesamiento con IA',
            description: 'Los datos se interpretan con algoritmos de aprendizaje automático para identificar patrones de riesgo de forma consistente.',
            meta: 'Motor académico con margen de mejora',
            cardClass: 'bento-span-7 is-brain',
        },
        {
            icon: <FaLaptopMedical />,
            title: '3. Resultado de Probabilidad',
            description: 'La plataforma entrega una probabilidad orientativa en menos de 5 minutos para apoyar la toma de decisiones tempranas.',
            meta: 'Salida rápida, clara y comprensible',
            cardClass: 'bento-span-12 is-output',
        },
    ];

    const missionPillars = [
        {
            icon: <FaHeartbeat />,
            title: 'Accesible',
            text: 'Diseñada para que el proceso de tamizaje sea comprensible y usable para más personas.',
        },
        {
            icon: <FaLaptopMedical />,
            title: 'Rápida',
            text: 'Entrega una lectura orientativa en minutos para apoyar decisiones preventivas tempranas.',
        },
        {
            icon: <FaBrain />,
            title: 'En mejora continua',
            text: 'El enfoque académico permite iterar el modelo y fortalecer la utilidad del prototipo.',
        },
    ];

    return (
        <main className={`landing-page${performanceMode ? ' is-low-perf' : ''}`}>
            <div className="landing-bg-layer" aria-hidden="true">
                {blobs.map((blob) => (
                    <motion.span
                        key={blob.className}
                        className={`landing-blob ${blob.className}`}
                        animate={performanceMode ? { opacity: 0.5 } : blob.animate}
                        transition={performanceMode ? { duration: 0 } : { duration: blob.duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                    />
                ))}
            </div>

            <section className="landing-hero">
                <div className="landing-shell landing-hero-grid">
                    <HeroReveal className="landing-hero-copy">
                        <SectionEyebrow>Prototipo académico de tamizaje impulsado por IA</SectionEyebrow>
                        <h1>DiabetesIA: Tu salud, en un clic</h1>
                        <p>
                            Un prototipo académico diseñado para la detección temprana y el tamizaje de la Diabetes Tipo 2.
                        </p>

                        <div className="landing-hero-actions">
                            <motion.button
                                type="button"
                                className="landing-primary-button"
                                onClick={handleScreeningDemo}
                                whileHover={performanceMode ? undefined : { y: -3, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                transition={performanceMode ? undefined : { duration: 0.2 }}
                            >
                                Probar Tamizaje
                                <FaArrowRight />
                            </motion.button>
                            <Link className="landing-secondary-button" to="/login">
                                Iniciar sesión
                            </Link>
                        </div>

                        <div className={`landing-status-card is-${screeningState}`}>
                            <div className="landing-status-pill">
                                <span className="landing-status-dot" />
                                {screeningState === 'processing' ? 'Procesando demo' : screeningState === 'success' ? 'Simulación completada' : 'Prototipo académico'}
                            </div>
                            <p>{resultText}</p>
                        </div>
                    </HeroReveal>

                    <HeroReveal className="landing-hero-visual" delay={140}>
                        <div className="landing-hero-panel">
                            <div className="landing-hero-content">
                                <div className="landing-hero-panel-top">
                                    <div>
                                        <span className="landing-mini-label">Impacto esperado</span>
                                        <strong>Prevención y detección oportuna</strong>
                                    </div>
                                    <div className="landing-icon-badge">
                                        <FaHeartbeat />
                                    </div>
                                </div>

                                <div className="landing-metric-card">
                                    <span>Tiempo estimado de respuesta</span>
                                    <strong>&lt; 5 min</strong>
                                </div>

                                <div className="landing-visual-grid">
                                    <article>
                                        <span>Precisión orientativa</span>
                                        <strong>En evolución</strong>
                                    </article>
                                    <article>
                                        <span>Enfoque</span>
                                        <strong>Tamizaje accesible</strong>
                                    </article>
                                </div>

                                <div className="landing-note">
                                    <FaStethoscope />
                                    <p>La herramienta no sustituye el criterio médico. Funciona como apoyo temprano dentro de un contexto académico.</p>
                                </div>
                            </div>

                            <motion.div
                                className="landing-brand-watermark"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                                aria-hidden="true"
                            >
                                <img
                                    className="landing-brand-logo landing-brand-logo--watermark"
                                    src={logoSrc}
                                    alt=""
                                />
                            </motion.div>
                        </div>
                    </HeroReveal>
                </div>
            </section>

            <section className="landing-awareness">
                <div className="landing-shell">
                    <Reveal className="landing-awareness-card">
                        <div className="landing-awareness-bubbles" aria-hidden="true">
                            <span className="landing-awareness-bubble bubble-1" />
                            <span className="landing-awareness-bubble bubble-2" />
                            <span className="landing-awareness-bubble bubble-3" />
                            <span className="landing-awareness-bubble bubble-4" />
                        </div>

                        <div className="landing-awareness-content">
                            <SectionEyebrow>Concientización</SectionEyebrow>
                            <h2>La Diabetes Tipo 2 puede avanzar en silencio</h2>
                            <p>
                                Muchos diagnósticos llegan tarde porque los síntomas suelen pasar desapercibidos o se confunden con fatiga cotidiana. Esa demora incrementa complicaciones, retrasa cambios preventivos y limita intervenciones oportunas.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            <section className="landing-process">
                <div className="landing-shell">
                    <Reveal className="landing-section-heading">
                        <SectionEyebrow>Funcionamiento</SectionEyebrow>
                        <h2>Proceso técnico del prototipo</h2>
                        <p>
                            Un flujo simple, comprensible y orientado a entregar una lectura de riesgo rápida para escenarios de tamizaje académico.
                        </p>
                    </Reveal>

                    <div className="landing-process-grid">
                        {processSteps.map((step, index) => (
                            <Reveal key={step.title} className={step.cardClass} delay={index * 120}>
                                <ProcessCard icon={step.icon} title={step.title} description={step.description} meta={step.meta} disableHover={performanceMode} />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="landing-mission">
                <div className="landing-shell">
                    <Reveal className="landing-mission-card">
                        <div className="landing-mission-main">
                            <div className="landing-mission-copy">
                                <SectionEyebrow>Misión Académica</SectionEyebrow>
                                <h2>Una herramienta rápida, accesible y abierta a mejora continua</h2>
                                <motion.p
                                    initial={reduceMotion ? { opacity: 0, y: 6 } : { opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.35 }}
                                    transition={{ duration: reduceMotion ? 0.3 : 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    DiabetesIA busca apoyar el tamizaje de esta enfermedad con una experiencia clara, útil y con enfoque preventivo para contextos académicos y comunitarios.
                                </motion.p>
                            </div>

                            <div className="landing-mission-pillars">
                                {missionPillars.map((pillar, index) => (
                                    <Reveal key={pillar.title} className="landing-mission-pillar" delay={90 + index * 90}>
                                        <div className="landing-mission-pillar-head">
                                            <motion.span
                                                className="landing-mission-icon"
                                                whileHover={performanceMode ? undefined : { rotate: [0, -8, 6, 0], scale: 1.1 }}
                                                animate={
                                                    performanceMode
                                                        ? undefined
                                                        : { y: [0, -3, 0], rotate: [0, -3, 3, 0], scale: [1, 1.03, 1] }
                                                }
                                                transition={
                                                    performanceMode
                                                        ? undefined
                                                        : {
                                                              duration: 2.6,
                                                              repeat: Infinity,
                                                              repeatType: 'mirror',
                                                              delay: index * 0.22,
                                                              ease: 'easeInOut',
                                                          }
                                                }
                                            >
                                                {pillar.icon}
                                            </motion.span>
                                            <h3>{pillar.title}</h3>
                                        </div>
                                        <motion.p
                                            initial={reduceMotion ? { opacity: 0, y: 4 } : { opacity: 0, y: 14 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: reduceMotion ? 0.28 : 0.5, delay: 0.03 * (index + 1), ease: [0.22, 1, 0.36, 1] }}
                                            whileHover={performanceMode ? undefined : { x: 2 }}
                                        >
                                            {pillar.text}
                                        </motion.p>
                                    </Reveal>
                                ))}
                            </div>
                        </div>

                        <div className="landing-mission-foot">
                            <div className="landing-mission-tags">
                                <span>IA orientada al tamizaje</span>
                                <span>Respuesta &lt; 5 min</span>
                                <span>Innovación responsable</span>
                            </div>

                            <motion.p
                                className="landing-mission-disclaimer"
                                initial={reduceMotion ? { opacity: 0, y: 4 } : { opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.35 }}
                                transition={{ duration: reduceMotion ? 0.3 : 0.5, delay: 0.09, ease: [0.22, 1, 0.36, 1] }}
                                whileHover={performanceMode ? undefined : { x: 3 }}
                            >
                                Este prototipo no sustituye el diagnóstico clínico. Su objetivo es fortalecer la detección temprana y la concientización.
                            </motion.p>
                        </div>

                        <motion.p
                            className="landing-mission-closing"
                            initial={reduceMotion ? { opacity: 0, y: 4 } : { opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.35 }}
                            transition={{ duration: reduceMotion ? 0.3 : 0.52, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={performanceMode ? undefined : { x: 3 }}
                        >
                            Proporcionar un prototipo académico con margen de mejora que ayude al tamizaje de esta enfermedad, asegurando que sea una herramienta accesible y rápida.
                        </motion.p>
                    </Reveal>
                </div>
            </section>

            <section className="landing-about">
                <div className="landing-about-bubbles" aria-hidden="true">
                    <span className="landing-about-bubble about-bubble-1" />
                    <span className="landing-about-bubble about-bubble-2" />
                    <span className="landing-about-bubble about-bubble-3" />
                    <span className="landing-about-bubble about-bubble-4" />
                </div>

                <div className="landing-shell landing-about-grid landing-about-bento">
                    <Reveal className="bento-span-7">
                        <SectionEyebrow>Sobre Nosotros</SectionEyebrow>
                        <h2>Freddy Alvarado</h2>
                        <p>
                            Estudiante de Ingeniería en Informática de la UNELLEZ y autor de DiabetesIA, una propuesta que busca combinar tecnología, prevención y comunicación clara para acercar el tamizaje a más personas.
                        </p>
                        <div className="landing-campaign-box">
                            <strong>Campaña:</strong>
                            <span>Tu salud, en un clic</span>
                            <strong>Objetivo:</strong>
                            <p >Proporcionar un prototipo académico con margen de mejora que ayude al tamizaje de la Diabetes Tipo 2, asegurando que sea una herramienta accesible y rápida para todos.</p>
                        </div>
                    </Reveal>

                    <Reveal className="bento-span-5" delay={140}>
                        <div className="landing-social-wrap">
                            <h3>Redes sociales</h3>
                            <p>Canales pensados para divulgar educación preventiva, avances del prototipo y mensajes de salud con enfoque responsable.</p>

                            <div className="landing-social-list">
                                <Reveal delay={80}>
                                    <SocialLinkCard
                                        href="https://www.instagram.com/diabetes_ia?igsh=MWZlM3M1b3RnMGVkMw=="
                                        label="Instagram"
                                        icon={<FaInstagram />}
                                        disableHover={performanceMode}
                                        description="Contenido visual de campaña, comunidad y crecimiento."
                                    />
                                </Reveal>
                                <Reveal delay={160}>
                                    <SocialLinkCard
                                        href="https://www.facebook.com/"
                                        label="Facebook"
                                        icon={<FaFacebookF />}
                                        disableHover={performanceMode}
                                        description="Difusión de publicaciones educativas y mensajes clave para una audiencia más amplia."
                                    />
                                </Reveal>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            <footer className="landing-footer">
                <div className="landing-shell">
                    <p>DiabetesIA - Innovación responsable en salud. 2026</p>
                </div>
            </footer>
        </main>
    );
}

export default Landing;