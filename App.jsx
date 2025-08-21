import React, { useState, useEffect } from 'react';

// Main App Component
const App = () => {
    // State for the mobile menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // State for the AI idea generator
    const [ideaInput, setIdeaInput] = useState('');
    const [ideaOutput, setIdeaOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // State for the slideshow
    const [slideIndex, setSlideIndex] = useState(0);
    const slides = [
        {
            title: 'Inovando o Futuro com Tecnologia',
            text: 'A Default cria soluções tecnológicas que transformam ideias em realidade.',
            linkText: 'Descubra Nossos Serviços',
            linkHref: '#services',
        },
        {
            title: 'Especialistas em Machine Learning',
            text: 'Construa sistemas inteligentes que aprendem e evoluem com o seu negócio.',
            linkText: 'Conheça o ML',
            linkHref: '#services',
        },
        {
            title: 'Soluções sob Medida',
            text: 'Seja para web, mobile ou consultoria, temos a solução ideal para você.',
            linkText: 'Fale Conosco',
            linkHref: '#contact',
        },
    ];

    // Slideshow effect
    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(interval);
    }, [slides.length]);

    // Handle smooth scrolling
    useEffect(() => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }, []);

    // Function to handle AI idea generation
    const generateIdea = async () => {
        if (!ideaInput.trim()) {
            setIdeaOutput('<p class="text-red-500">Por favor, descreva sua ideia ou problema.</p>');
            return;
        }

        setIsLoading(true);
        setIdeaOutput('');

        const fullPrompt = `Você é um consultor de tecnologia da empresa Default. Sua tarefa é analisar a seguinte ideia ou problema e propor uma solução tecnológica. Estruture sua resposta da seguinte forma, utilizando apenas HTML (com tags como h3, p, ul, li), sem Markdown.
        
        ### Análise e Solução Tecnológica
        
        **Ideia/Problema:** [Repita a ideia do usuário aqui]
        
        **Solução Proposta:** [Proponha uma solução tecnológica detalhada, mencionando quais serviços da Default (Desenvolvimento Web, Aplicativos Mobile, Machine Learning, Consultoria Técnica) seriam aplicados.]
        
        **Tecnologias Recomendadas:** [Liste 3 a 5 tecnologias (ex: Python, React, Flask, TensorFlow, etc.) que seriam adequadas para a solução, explicando brevemente o porquê.]
        
        **Próximos Passos:** [Sugira 2 ou 3 passos práticos para iniciar o projeto, como 'Consultoria inicial' ou 'Desenvolvimento de MVP'.]
        
        A seguir está a ideia/problema do usuário: "${ideaInput}"`;

        let retries = 0;
        const maxRetries = 3;
        let delay = 1000;
        
        const modelName = "gemini-2.5-flash-preview-05-20";
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        while (retries < maxRetries) {
            try {
                const payload = {
                    contents: [{
                        parts: [{ text: fullPrompt }]
                    }]
                };

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.statusText}`);
                }

                const result = await response.json();
                const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

                if (text) {
                    setIdeaOutput(text);
                    setIsLoading(false);
                    return;
                } else {
                    throw new Error("Invalid response format from API.");
                }
            } catch (error) {
                console.error("Failed to generate content:", error);
                retries++;
                if (retries < maxRetries) {
                    await new Promise(res => setTimeout(res, delay));
                    delay *= 2;
                } else {
                    setIdeaOutput('<p class="text-red-500">Desculpe, não foi possível gerar uma ideia no momento. Por favor, tente novamente mais tarde.</p>');
                    setIsLoading(false);
                }
            }
        }
    };

    // React component for the header
    const Header = () => (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="#hero" className="text-2xl font-bold text-gray-900">Default</a>
                <div className="md:hidden">
                    <button id="menu-button" onClick={toggleMenu} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
                <div id="nav-links" className="hidden md:flex space-x-8">
                    <a href="#services" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Serviços</a>
                    <a href="#projects" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Projetos</a>
                    <a href="#certifications" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Certificados</a>
                    <a href="#ia-ideas" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">IA de Ideias</a>
                    <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Sobre Nós</a>
                    <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">Contato</a>
                </div>
            </nav>
            <div id="mobile-menu" className={`md:hidden bg-white shadow-lg py-4 ${isMenuOpen ? '' : 'hidden'}`}>
                <a href="#services" onClick={toggleMenu} className="block px-6 py-2 text-gray-800 hover:bg-gray-100">Serviços</a>
                <a href="#projects" onClick={toggleMenu} className="block px-6 py-2 text-gray-800 hover:bg-gray-100">Projetos</a>
                <a href="#certifications" onClick={toggleMenu} className="block px-6 py-2 text-gray-800 hover:bg-gray-100">Certificados</a>
                <a href="#ia-ideas" onClick={toggleMenu} className="block px-6 py-2 text-gray-800 hover:bg-gray-100">IA de Ideias</a>
                <a href="#about" onClick={toggleMenu} className="block px-6 py-2 text-gray-800 hover:bg-gray-100">Sobre Nós</a>
                <a href="#contact" onClick={toggleMenu} className="block px-6 py-2 text-gray-800 hover:bg-gray-100">Contato</a>
            </div>
        </header>
    );

    // React component for the hero section
    const Hero = () => (
        <section id="hero" className="gradient-bg text-white py-20 md:py-32 relative overflow-hidden h-96">
            <div className="container mx-auto px-6 h-full flex items-center justify-center relative">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`slide ${index === slideIndex ? 'active' : ''}`}
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                            {slide.title}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90">
                            {slide.text}
                        </p>
                        <a href={slide.linkHref} className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-300 transform hover:scale-105">
                            {slide.linkText}
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );

    // React component for the services section
    const Services = () => (
        <section id="services" className="bg-white py-20">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Nossos Serviços</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                    <ServiceCard
                        title="Desenvolvimento Web"
                        description="Criamos sites e aplicações web modernos e escaláveis para impulsionar seu negócio."
                        svgPath="M9.75 17L9.75 14L22.5 14L22.5 17M9.75 17L12.75 22L12.75 17M12.75 17L12.75 22M14.25 17L14.25 14L1.5 14L1.5 17"
                    />
                    <ServiceCard
                        title="Aplicativos Mobile"
                        description="Desenvolvemos aplicativos nativos e híbridos para iOS e Android, com foco na experiência do usuário."
                        svgPath="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                    <ServiceCard
                        title="Consultoria Técnica"
                        description="Orientamos sua empresa com as melhores estratégias e tecnologias para atingir seus objetivos."
                        svgPath="M5 3v18l7-4 7 4V3a2 2 0 00-2-2H7a2 2 0 00-2 2z"
                    />
                    <ServiceCard
                        title="Machine Learning"
                        description="Implementamos soluções inteligentes para automação, análise de dados e previsão de resultados."
                        svgPath="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.608 3.292 0a1.724 1.724 0 002.573-1.066zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </div>
            </div>
        </section>
    );

    // Reusable Service Card component
    const ServiceCard = ({ title, description, svgPath }) => (
        <div className="p-8 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
            <div className="text-indigo-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={svgPath}></path>
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
            <p className="text-gray-600 text-center">{description}</p>
        </div>
    );

    // React component for the projects and awards section
    const Projects = () => (
        <section id="projects" className="bg-gray-100 py-20">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Nossos Projetos e Premiações</h2>
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-10">
                    <ProjectCard
                        title="🌞 Projeto Solar Site: Análise e Simulação Fotovoltaica"
                        imageSrc="./public/energiasolar1.jpeg"
                        description="Plataforma web interativa para análise e simulação de sistemas de energia solar fotovoltaica. Utiliza Python (Flask), HTML5, CSS3, JavaScript e integrações com Google Maps."
                        linkHref="https://solar-site-teal.vercel.app/login?next=%2F"
                    />
                    <ProjectCard
                        title="🚀 Sistema de Análise e Geração de Relatórios de NFe"
                        imageSrc="./public/projetoextracaodedados.jpeg"
                        description="Aplicação em Python (CustomTkinter) para processamento automatizado de arquivos XML de NFe. Extrai dados fiscais e gera relatórios em Excel usando Pandas e BeautifulSoup."
                        linkHref="#contact"
                    />
                </div>

                <div className="mt-16 text-center">
                    <h3 className="text-3xl font-bold mb-6 text-gray-900">Premiações</h3>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                        <AwardCard
                            title="1° Lugar - Hackacripto"
                            date="Nov de 2024"
                            description="Destaque no desenvolvimento de uma nova criptomoeda durante o evento do hackathon."
                        />
                        <AwardCard
                            title="3° Lugar - II Maratona de Programação"
                            date="Mai de 2025"
                            description="Conquistado na II Maratona de Programação da Universidade de Ribeirão Preto (UNAERP)."
                        />
                    </div>
                </div>
            </div>
        </section>
    );

    // Reusable Project Card component
    const ProjectCard = ({ title, imageSrc, description, linkHref }) => (
        <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <img src={imageSrc} alt={title} className="rounded-md mb-4 w-full" />
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <a href={linkHref} target="_blank" className="text-indigo-600 font-medium hover:underline">Ver Projeto &rarr;</a>
        </div>
    );

    // Reusable Award Card component
    const AwardCard = ({ title, date, description }) => (
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h4 className="text-xl font-semibold text-indigo-600">{title}</h4>
            <p className="text-gray-600">{date}</p>
            <p className="text-sm mt-2 text-gray-500">{description}</p>
        </div>
    );

    // React component for the certifications section
    const Certifications = () => (
        <section id="certifications" className="bg-white py-20">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Cursos e Certificações</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
                    <CertificationCard title="Curso Flutter completo/Atualizado 2025" institution="Udemy" date="Mai de 2025" competencies="Desenvolvimento mobile Android/IOS/Windows." />
                    <CertificationCard title="Introduction to Cybersecurity" institution="Cisco Networking Academy" date="Jan de 2025" />
                    <CertificationCard title="Hacker Ético Profissional com Kali Linux v2025" institution="Udemy" date="Dez de 2024" competencies="Coleta de informações, SQL Injection, Metasploit, NMAP, Python Básico, entre outras." />
                    <CertificationCard title="Conceitos Básicos de Redes" institution="Cisco Networking Academy" date="Nov de 2024" competencies="Administração de redes, Configuração de roteador." />
                    <CertificationCard title="Hacker Ético com Metasploit" institution="Udemy" date="Jun de 2025" />
                    <CertificationCard title="Tecnologia de AI generativa" institution="Senai São Paulo" date="Abr de 2025" competencies="Automação, Inteligência artificial." />
                    <CertificationCard title="Aprendizado de máquina e Deep learning" institution="IBM" date="Mar de 2025" competencies="Automação, Lógica de programação." />
                    <CertificationCard title="Execute modelos de IA com o IBM Watson Studio" institution="IBM" date="Mar de 2025" competencies="Automação, Lógica de programação." />
                    <CertificationCard title="Processamento de linguagem natural e visão por computador" institution="IBM" date="Mar de 2025" competencies="Automação." />
                    <CertificationCard title="Django 2.0 - Conceitos fundamentais" institution="Udemy" date="Jan de 2025" competencies="Django, Python." />
                    <CertificationCard title="Free: YOLOv7 Custom object Detection Course" institution="Udemy" date="Jan de 2025" />
                    <CertificationCard title="Por dentro da Segurança Cibernética" institution="Senai São Paulo" date="Jan de 2025" />
                    <CertificationCard title="Curso de automação python" institution="Unaerp Digital" date="Set de 2024" competencies="Python, Automação, Inteligência artificial, Extração de dados." />
                    <CertificationCard title="Fundamentos de DART" institution="Senai São Paulo" date="Jun de 2024" />
                    <CertificationCard title="Redes" institution="SENAI Ribeirão Preto" date="Jul de 2023" competencies="Administração de redes, LAN-WAN, Configuração de roteador, Packet Tracer." />
                    <CertificationCard title="Power BI" institution="SENAI Ribeirão Preto" date="Jun de 2023" competencies="Microsoft Power BI." />
                </div>
            </div>
        </section>
    );

    // Reusable Certification Card component
    const CertificationCard = ({ title, institution, date, competencies }) => (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h4 className="text-xl font-semibold mb-1 text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600 mb-2">{institution} | {date}</p>
            {competencies && <p className="text-gray-700 text-sm">Competências: {competencies}</p>}
        </div>
    );
    
    // React component for the AI idea generator section
    const IdeaGenerator = () => (
        <section id="ia-ideas" className="bg-gray-100 py-20">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-8 text-gray-900">Gerador de Ideias com IA</h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
                    Descreva seu problema ou uma ideia de projeto. Nossa IA irá sugerir uma solução tecnológica sob medida para você!
                </p>
                <div className="max-w-3xl mx-auto space-y-4">
                    <textarea
                        id="idea-input"
                        rows="5"
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ex: 'Preciso de um aplicativo para gerenciar agendamentos de pet shop.'"
                        value={ideaInput}
                        onChange={(e) => setIdeaInput(e.target.value)}
                    ></textarea>
                    <button
                        id="generate-btn"
                        onClick={generateIdea}
                        className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105"
                    >
                        Gerar Ideia ✨
                    </button>
                    {isLoading && (
                        <div id="loading-indicator" className="mt-4 text-center text-indigo-600">
                            Gerando solução...
                        </div>
                    )}
                    {ideaOutput && (
                        <div id="idea-output" className="mt-8 p-6 bg-white rounded-lg shadow-lg text-left" dangerouslySetInnerHTML={{ __html: ideaOutput }}></div>
                    )}
                </div>
            </div>
        </section>
    );

    // React component for the about section
    const About = () => (
        <section id="about" className="bg-white py-20">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-8 text-gray-900">Quem Somos</h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                    A Default nasceu da paixão por tecnologia e da vontade de criar soluções que realmente fazem a diferença. Nossa equipe de especialistas trabalha lado a lado com os clientes para entender seus desafios e entregar produtos inovadores, eficientes e de alta qualidade.
                </p>
            </div>
        </section>
    );

    // React component for the contact section
    const Contact = () => (
        <section id="contact" className="bg-gray-100 py-20">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">Entre em Contato</h2>
                <div className="max-w-xl mx-auto text-center">
                    <p className="text-lg text-gray-700 mb-6">Fale conosco diretamente via WhatsApp, e-mail, Instagram ou LinkedIn!</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                        <a href="https://wa.me/5516994522838" className="inline-block bg-green-500 text-white font-bold py-3 px-6 rounded-md shadow-lg hover:bg-green-600 transition-colors duration-300 transform hover:scale-105">
                            WhatsApp
                        </a>
                        <a href="mailto:nicolas.jussiani@hotmail.com" className="inline-block bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-md shadow-lg hover:bg-gray-300 transition-colors duration-300 transform hover:scale-105">
                            E-mail
                        </a>
                    </div>
                    <p className="text-gray-600">Siga-nos em nossas redes:
                        <a href="https://www.instagram.com/umpoucosobretech" target="_blank" className="text-indigo-600 hover:underline">@umpoucosobretech</a> e
                        <a href="https://www.linkedin.com/in/nicolas-giussani-a401b329b" target="_blank" className="text-indigo-600 hover:underline">LinkedIn</a>
                    </p>
                </div>
            </div>
        </section>
    );

    // React component for the footer
    const Footer = () => (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-6 text-center text-sm">
                <p>&copy; 2024 Default. Todos os direitos reservados.</p>
            </div>
        </footer>
    );

    return (
        <div className="antialiased" style={{ backgroundImage: "url('./public/fundo.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center center', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}>
            <Header />
            <main className="content-overlay">
                <Hero />
                <Services />
                <Projects />
                <Certifications />
                <IdeaGenerator />
                <About />
                <Contact />
            </main>
            <Footer />
        </div>
    );
};

export default App;
