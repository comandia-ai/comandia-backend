import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Building2, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { useAppStore, useTenantsStore } from '@/hooks/useStore';

export function Login() {
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLanguage();
  const { login } = useAppStore();
  const { tenants } = useTenantsStore();

  const [selectedTenant, setSelectedTenant] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!selectedTenant) {
      setError(language === 'es' ? 'Seleccione una empresa' : 'Select a company');
      setIsLoading(false);
      return;
    }

    const success = login(selectedTenant, email || 'demo@example.com');
    if (success) {
      navigate('/dashboard');
    } else {
      setError(language === 'es' ? 'Error al iniciar sesion' : 'Login failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-whatsapp-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">PedidosYA</h1>
              <p className="text-white/80 text-sm">WhatsApp B2B SaaS</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            {language === 'es'
              ? 'Gestiona tus pedidos por WhatsApp'
              : 'Manage your orders via WhatsApp'}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-md">
            {language === 'es'
              ? 'Plataforma inteligente para mayoristas. Recibe y procesa pedidos automaticamente con IA conversacional.'
              : 'Smart platform for wholesalers. Receive and process orders automatically with conversational AI.'}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span>{language === 'es' ? 'Pedidos via WhatsApp' : 'Orders via WhatsApp'}</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span>{language === 'es' ? 'Multi-tenant desde el dia uno' : 'Multi-tenant from day one'}</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mb-48"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Language Toggle */}
          <div className="flex justify-end mb-8">
            <div className="inline-flex rounded-lg border border-slate-200 p-1">
              <button
                onClick={() => changeLanguage('es')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  language === 'es' ? 'bg-primary text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  language === 'en' ? 'bg-primary text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-whatsapp to-whatsapp-dark rounded-xl flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">PedidosYA</h1>
              <p className="text-slate-500 text-sm">WhatsApp B2B SaaS</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('auth.welcome')}</h2>
            <p className="text-slate-500">{t('auth.loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tenant Selection */}
            <div className="space-y-2">
              <Label htmlFor="tenant" className="text-slate-700">
                {t('auth.selectTenant')}
              </Label>
              <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={language === 'es' ? 'Seleccionar empresa...' : 'Select company...'} />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      <div className="flex items-center gap-2">
                        {tenant.logo ? (
                          <img src={tenant.logo} alt="" className="w-6 h-6 rounded object-cover" />
                        ) : (
                          <Building2 className="w-6 h-6 text-slate-400" />
                        )}
                        <div>
                          <span className="font-medium">{tenant.name}</span>
                          <span className="text-slate-400 ml-2 text-xs">({tenant.city})</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                {t('auth.email')}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@empresa.com"
                  className="h-12 pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                {t('auth.password')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="h-12 pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{language === 'es' ? 'Ingresando...' : 'Signing in...'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{t('auth.login')}</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Demo note */}
          <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              {language === 'es'
                ? 'Demo: Seleccione cualquier empresa y use cualquier email'
                : 'Demo: Select any company and use any email'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
