
import React, { useState, useRef, useEffect } from 'react';
import { CompanyProfile } from '../types';
import { Store, BarChart3, ArrowRight, Lock, Mail, Upload, X, CheckCircle, ArrowLeft, RefreshCw, ShieldCheck, TrendingUp, PieChart, DollarSign, Activity } from 'lucide-react';

interface AuthProps {
    onLogin: (user: CompanyProfile) => void;
}

type AuthMode = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';
type ForgotStep = 'EMAIL' | 'CAPTCHA' | 'NEW_PASSWORD';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [mode, setMode] = useState<AuthMode>('LOGIN');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    // Form State - Login/Register
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [type, setType] = useState('Restaurante');
    const [logoUrl, setLogoUrl] = useState('');

    // Form State - Forgot Password
    const [forgotStep, setForgotStep] = useState<ForgotStep>('EMAIL');
    const [resetEmail, setResetEmail] = useState('');
    
    // Captcha State
    const [captchaValue, setCaptchaValue] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper to get users
    const getUsers = (): CompanyProfile[] => {
        const usersStr = localStorage.getItem('gastro_users');
        return usersStr ? JSON.parse(usersStr) : [];
    };

    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (I, 1, 0, O)
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaValue(result);
        setCaptchaInput('');
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            onLogin(user);
        } else {
            setError('Email ou senha inválidos.');
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError('Preencha os campos obrigatórios.');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        const users = getUsers();

        if (users.some(u => u.email === email)) {
            setError('Este email já está cadastrado.');
            return;
        }

        const newUser: CompanyProfile = {
            id: Date.now().toString(),
            name,
            email,
            password,
            type,
            logoUrl
        };

        const updatedUsers = [...users, newUser];
        try {
            localStorage.setItem('gastro_users', JSON.stringify(updatedUsers));
            
            // Initialize empty data for new user
            const initialData = { sales: [], expenses: [], inventory: [] };
            localStorage.setItem(`gastro_data_${newUser.id}`, JSON.stringify(initialData));

            onLogin(newUser);
        } catch (err) {
            setError('Erro ao salvar dados. A imagem do logo pode ser muito grande.');
            console.error(err);
        }
    };

    // --- Forgot Password Logic ---

    const handleCheckEmail = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const users = getUsers();
        const userExists = users.some(u => u.email === resetEmail);

        if (!userExists) {
            setError('Email não encontrado no sistema.');
            return;
        }

        // Move to Captcha Step
        generateCaptcha();
        setForgotStep('CAPTCHA');
        setSuccessMsg('');
    };

    const handleVerifyCaptcha = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (captchaInput.toUpperCase() === captchaValue) {
            setForgotStep('NEW_PASSWORD');
            setSuccessMsg('Verificação de segurança concluída.');
        } else {
            setError('Captcha incorreto. Tente novamente.');
            generateCaptcha(); // Refresh captcha on error
        }
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        const users = getUsers();
        const updatedUsers = users.map(u => {
            if (u.email === resetEmail) {
                return { ...u, password: password };
            }
            return u;
        });

        localStorage.setItem('gastro_users', JSON.stringify(updatedUsers));
        
        alert('Senha redefinida com sucesso! Faça login com sua nova senha.');
        setMode('LOGIN');
        // Reset states
        setResetEmail('');
        setPassword('');
        setConfirmPassword('');
        setForgotStep('EMAIL');
    };

    // --- File Handling ---

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 500 * 1024) {
            setError('A imagem é muito grande. Máximo permitido: 500KB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoUrl(reader.result as string);
            setError('');
        };
        reader.readAsDataURL(file);
    };

    const clearLogo = () => {
        setLogoUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // --- Render Components ---

    return (
        <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes float-delayed {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(15px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes float-sideways {
                    0% { transform: translateX(0px) rotate(0deg); }
                    50% { transform: translateX(20px) rotate(5deg); }
                    100% { transform: translateX(0px) rotate(0deg); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
                .animate-float-sideways { animation: float-sideways 8s ease-in-out infinite; }
            `}</style>

            {/* --- Animated Background Elements --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

                {/* Glowing Blobs */}
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-1/2 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[150px]"></div>

                {/* Floating Financial Icons with Blur */}
                <div className="absolute top-[15%] left-[10%] opacity-20 text-green-500 animate-float blur-[2px]">
                    <TrendingUp size={120} strokeWidth={1.5} />
                </div>
                
                <div className="absolute bottom-[20%] right-[10%] opacity-20 text-blue-500 animate-float-delayed blur-[3px]">
                    <PieChart size={140} strokeWidth={1.5} />
                </div>

                <div className="absolute top-[10%] right-[25%] opacity-10 text-purple-500 animate-float-sideways blur-[4px]">
                    <BarChart3 size={80} strokeWidth={2} />
                </div>

                <div className="absolute bottom-[10%] left-[20%] opacity-10 text-yellow-500 animate-float blur-[2px]">
                    <DollarSign size={100} strokeWidth={1} />
                </div>

                <div className="absolute top-[40%] right-[5%] opacity-10 text-cyan-500 animate-float-delayed blur-[5px]">
                    <Activity size={90} strokeWidth={1.5} />
                </div>
            </div>

            {/* --- Main Card --- */}
            <div className="w-full max-w-md bg-[#1E1E1E]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative z-10 overflow-hidden">
                {/* Card Top Gradient Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-400 to-primary"></div>

                <div className="p-8">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-700 text-white mb-4 shadow-lg shadow-blue-900/50 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                            <BarChart3 size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
                            Open Finance
                        </h1>
                        <p className="text-gray-400 text-sm font-light">
                            {mode === 'LOGIN' && 'Inteligência financeira para seu negócio'}
                            {mode === 'REGISTER' && 'Comece a controlar suas finanças hoje'}
                            {mode === 'FORGOT_PASSWORD' && 'Recuperação de acesso'}
                        </p>
                    </div>

                    {/* --- LOGIN & REGISTER FORM --- */}
                    {(mode === 'LOGIN' || mode === 'REGISTER') && (
                        <form onSubmit={mode === 'REGISTER' ? handleRegister : handleLogin} className="space-y-5">
                            
                            {mode === 'REGISTER' && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 font-medium ml-1">Nome da Empresa</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                                <Store size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                placeholder="Ex: Pizzaria do João"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 font-medium ml-1">Tipo de Negócio</label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-primary outline-none"
                                        >
                                            <option value="Restaurante">Restaurante</option>
                                            <option value="Lanchonete">Lanchonete</option>
                                            <option value="Pizzaria">Pizzaria</option>
                                            <option value="Delivery">Delivery</option>
                                            <option value="Cafeteria">Cafeteria</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 font-medium ml-1">Logo da Empresa</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            
                                            {!logoUrl ? (
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-full bg-[#121212] border border-dashed border-gray-600 rounded-lg py-4 px-4 text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2"
                                                >
                                                    <Upload size={24} />
                                                    <span className="text-sm">Clique para enviar logo (Max 500KB)</span>
                                                </button>
                                            ) : (
                                                <div className="relative w-full h-32 bg-[#121212] rounded-lg border border-gray-700 overflow-hidden flex items-center justify-center group">
                                                    <img src={logoUrl} alt="Preview" className="h-full object-contain" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={clearLogo}
                                                            className="bg-red-600 p-2 rounded-full text-white hover:bg-red-700 transition-colors"
                                                            title="Remover Logo"
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 font-medium ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        placeholder="seu@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 font-medium ml-1">Senha</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {mode === 'REGISTER' && (
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-medium ml-1">Confirmar Senha</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {mode === 'LOGIN' && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode('FORGOT_PASSWORD');
                                            setError('');
                                            setSuccessMsg('');
                                            setForgotStep('EMAIL');
                                            setResetEmail('');
                                        }}
                                        className="text-xs text-gray-400 hover:text-primary transition-colors"
                                    >
                                        Esqueci minha senha
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="p-3 rounded bg-red-900/20 border border-red-900 text-red-200 text-xs text-center animate-pulse">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 transform hover:-translate-y-0.5"
                            >
                                {mode === 'REGISTER' ? 'Criar Conta' : 'Entrar no Sistema'}
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    )}

                    {/* --- FORGOT PASSWORD FLOW --- */}
                    {mode === 'FORGOT_PASSWORD' && (
                         <div className="space-y-4">
                            
                            <button 
                                onClick={() => setMode('LOGIN')}
                                className="flex items-center text-xs text-gray-400 hover:text-white mb-2 transition-colors"
                            >
                                <ArrowLeft size={14} className="mr-1" /> Voltar ao Login
                            </button>

                            {forgotStep === 'EMAIL' && (
                                <form onSubmit={handleCheckEmail} className="space-y-4 animate-in fade-in duration-300">
                                    <p className="text-sm text-gray-300">Digite seu email para iniciar a recuperação de senha.</p>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 font-medium ml-1">Email Cadastrado</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-primary outline-none"
                                                placeholder="seu@email.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/30">
                                        Continuar
                                    </button>
                                </form>
                            )}

                            {forgotStep === 'CAPTCHA' && (
                                <form onSubmit={handleVerifyCaptcha} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                    <div className="text-center space-y-2">
                                        <div className="flex justify-center text-yellow-500 mb-2">
                                            <ShieldCheck size={32} />
                                        </div>
                                        <h3 className="text-white font-medium">Verificação de Segurança</h3>
                                        <p className="text-sm text-gray-400">Digite os caracteres abaixo para verificar.</p>
                                    </div>

                                    {/* Captcha Display */}
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative w-full bg-white rounded-lg p-6 flex items-center justify-center overflow-hidden select-none border-2 border-gray-600 shadow-inner">
                                            {/* Noise Lines */}
                                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)'}}></div>
                                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
                                            
                                            {/* Text */}
                                            <span className="text-4xl font-mono font-black tracking-[0.5em] text-black transform -rotate-2 z-10 drop-shadow-md" style={{textDecoration: 'line-through'}}>
                                                {captchaValue}
                                            </span>
                                        </div>
                                        
                                        <button 
                                            type="button" 
                                            onClick={generateCaptcha}
                                            className="text-xs flex items-center gap-1 text-primary hover:text-white transition-colors"
                                        >
                                            <RefreshCw size={14} /> Gerar novo código
                                        </button>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 font-medium ml-1">Digite o código acima</label>
                                        <input
                                            type="text"
                                            value={captchaInput}
                                            onChange={(e) => setCaptchaInput(e.target.value)}
                                            className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 px-4 text-white text-center text-lg tracking-widest font-mono uppercase placeholder-gray-700 focus:border-primary outline-none"
                                            placeholder="XXXXXX"
                                            maxLength={6}
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    <button type="submit" className="w-full bg-success hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-green-900/30">
                                        Verificar
                                    </button>
                                </form>
                            )}

                            {forgotStep === 'NEW_PASSWORD' && (
                                <form onSubmit={handleResetPassword} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                    <p className="text-sm text-gray-300">Segurança verificada. Crie sua nova senha.</p>
                                    
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 font-medium ml-1">Nova Senha</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-primary outline-none"
                                                placeholder="Nova senha"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 font-medium ml-1">Confirmar Nova Senha</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-primary outline-none"
                                                placeholder="Confirme a senha"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30">
                                        <CheckCircle size={18} /> Redefinir Senha
                                    </button>
                                </form>
                            )}

                            {error && (
                                <div className="p-3 rounded bg-red-900/20 border border-red-900 text-red-200 text-xs text-center animate-pulse">
                                    {error}
                                </div>
                            )}
                            {successMsg && (
                                <div className="p-3 rounded bg-green-900/20 border border-green-900 text-green-200 text-xs text-center">
                                    {successMsg}
                                </div>
                            )}
                         </div>
                    )}

                    <div className="mt-6 text-center border-t border-gray-800 pt-6">
                        {mode !== 'FORGOT_PASSWORD' && (
                            <p className="text-gray-400 text-sm">
                                {mode === 'REGISTER' ? 'Já tem uma conta?' : 'Não tem conta ainda?'}
                                <button
                                    onClick={() => {
                                        setMode(mode === 'REGISTER' ? 'LOGIN' : 'REGISTER');
                                        setError('');
                                        setSuccessMsg('');
                                        setEmail('');
                                        setPassword('');
                                        setLogoUrl('');
                                    }}
                                    className="ml-2 text-primary hover:text-blue-400 font-medium transition-colors"
                                >
                                    {mode === 'REGISTER' ? 'Fazer Login' : 'Cadastre-se'}
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
