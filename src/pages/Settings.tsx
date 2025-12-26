import { useState } from 'react';
import {
  Building2,
  MessageCircle,
  Bell,
  Clock,
  Save,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguage';
import { useAppStore } from '@/hooks/useStore';

export function Settings() {
  const { t, language } = useLanguage();
  const { currentTenant } = useAppStore();
  const [isSaving, setIsSaving] = useState(false);

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    businessName: currentTenant?.name || '',
    address: currentTenant?.address || '',
    city: currentTenant?.city || '',
    country: currentTenant?.country || '',
    timezone: currentTenant?.timezone || 'America/Bogota',
    currency: currentTenant?.currency || 'COP',
  });

  // WhatsApp settings
  const [whatsappSettings, setWhatsappSettings] = useState({
    phoneNumber: currentTenant?.whatsappNumber || '',
    welcomeMessage:
      currentTenant?.settings.welcomeMessage ||
      'Bienvenido a nuestra tienda. Como puedo ayudarte hoy?',
    confirmationTemplate:
      currentTenant?.settings.orderConfirmationTemplate ||
      'Gracias por tu pedido #{orderNumber}. Total: ${total}',
    autoConfirm: currentTenant?.settings.autoConfirmOrders || false,
    upsellEnabled: currentTenant?.settings.upsellEnabled ?? true,
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    dailyReports: false,
    weeklyReports: true,
  });

  // Business hours
  const [businessHours, setBusinessHours] = useState({
    start: currentTenant?.settings.businessHours.start || '08:00',
    end: currentTenant?.settings.businessHours.end || '18:00',
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success toast (in a real app)
    alert(language === 'es' ? 'Configuracion guardada' : 'Settings saved');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('settings.title')}</h1>
          <p className="text-slate-500 mt-1">
            {language === 'es'
              ? 'Administra la configuracion de tu negocio'
              : 'Manage your business settings'}
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              {language === 'es' ? 'Guardando...' : 'Saving...'}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {t('settings.save')}
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="general" className="gap-2">
            <Building2 className="w-4 h-4" />
            {t('settings.general')}
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            {t('settings.notifications')}
          </TabsTrigger>
          <TabsTrigger value="hours" className="gap-2">
            <Clock className="w-4 h-4" />
            {t('settings.businessHours')}
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.general')}</CardTitle>
              <CardDescription>
                {language === 'es'
                  ? 'Informacion basica de tu negocio'
                  : 'Basic information about your business'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{t('settings.businessName')}</Label>
                  <Input
                    value={generalSettings.businessName}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, businessName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.address')}</Label>
                  <Input
                    value={generalSettings.address}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, address: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ciudad</Label>
                  <Input
                    value={generalSettings.city}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === 'es' ? 'Pais' : 'Country'}</Label>
                  <Select
                    value={generalSettings.country}
                    onValueChange={(v) => setGeneralSettings({ ...generalSettings, country: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Colombia">Colombia</SelectItem>
                      <SelectItem value="Mexico">Mexico</SelectItem>
                      <SelectItem value="Peru">Peru</SelectItem>
                      <SelectItem value="Chile">Chile</SelectItem>
                      <SelectItem value="Argentina">Argentina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.timezone')}</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(v) => setGeneralSettings({ ...generalSettings, timezone: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Bogota">Bogota (GMT-5)</SelectItem>
                      <SelectItem value="America/Mexico_City">Ciudad de Mexico (GMT-6)</SelectItem>
                      <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                      <SelectItem value="America/Santiago">Santiago (GMT-4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.currency')}</Label>
                  <Select
                    value={generalSettings.currency}
                    onValueChange={(v) => setGeneralSettings({ ...generalSettings, currency: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                      <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                      <SelectItem value="PEN">PEN - Sol Peruano</SelectItem>
                      <SelectItem value="USD">USD - Dolar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Settings */}
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-whatsapp" />
                {language === 'es' ? 'Configuracion de WhatsApp' : 'WhatsApp Settings'}
              </CardTitle>
              <CardDescription>
                {language === 'es'
                  ? 'Configura tu integracion con WhatsApp Business'
                  : 'Configure your WhatsApp Business integration'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t('settings.phone')}</Label>
                <Input
                  value={whatsappSettings.phoneNumber}
                  onChange={(e) =>
                    setWhatsappSettings({ ...whatsappSettings, phoneNumber: e.target.value })
                  }
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('settings.welcomeMessage')}</Label>
                <Textarea
                  value={whatsappSettings.welcomeMessage}
                  onChange={(e) =>
                    setWhatsappSettings({ ...whatsappSettings, welcomeMessage: e.target.value })
                  }
                  rows={3}
                />
                <p className="text-xs text-slate-500">
                  {language === 'es'
                    ? 'Mensaje que se envia automaticamente cuando un cliente inicia una conversacion'
                    : 'Message automatically sent when a customer starts a conversation'}
                </p>
              </div>

              <div className="space-y-2">
                <Label>{t('settings.confirmationTemplate')}</Label>
                <Textarea
                  value={whatsappSettings.confirmationTemplate}
                  onChange={(e) =>
                    setWhatsappSettings({
                      ...whatsappSettings,
                      confirmationTemplate: e.target.value,
                    })
                  }
                  rows={3}
                />
                <p className="text-xs text-slate-500">
                  {language === 'es'
                    ? 'Variables disponibles: {orderNumber}, {total}, {customerName}'
                    : 'Available variables: {orderNumber}, {total}, {customerName}'}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{t('settings.autoConfirm')}</p>
                    <p className="text-sm text-slate-500">
                      {language === 'es'
                        ? 'Confirmar pedidos automaticamente sin revision manual'
                        : 'Automatically confirm orders without manual review'}
                    </p>
                  </div>
                  <Switch
                    checked={whatsappSettings.autoConfirm}
                    onCheckedChange={(checked) =>
                      setWhatsappSettings({ ...whatsappSettings, autoConfirm: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{t('settings.enableUpsell')}</p>
                    <p className="text-sm text-slate-500">
                      {language === 'es'
                        ? 'Mostrar sugerencias de productos adicionales'
                        : 'Show additional product suggestions'}
                    </p>
                  </div>
                  <Switch
                    checked={whatsappSettings.upsellEnabled}
                    onCheckedChange={(checked) =>
                      setWhatsappSettings({ ...whatsappSettings, upsellEnabled: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.notifications')}</CardTitle>
              <CardDescription>
                {language === 'es'
                  ? 'Configura tus preferencias de notificaciones'
                  : 'Configure your notification preferences'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-800">
                    {language === 'es' ? 'Notificaciones por email' : 'Email notifications'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {language === 'es'
                      ? 'Recibir notificaciones importantes por correo'
                      : 'Receive important notifications by email'}
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-800">
                    {language === 'es' ? 'Alertas de pedidos' : 'Order alerts'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {language === 'es'
                      ? 'Notificaciones cuando se recibe un nuevo pedido'
                      : 'Notifications when a new order is received'}
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.orderAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, orderAlerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-800">
                    {language === 'es' ? 'Alertas de stock bajo' : 'Low stock alerts'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {language === 'es'
                      ? 'Notificaciones cuando un producto tiene stock bajo'
                      : 'Notifications when a product has low stock'}
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.lowStockAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, lowStockAlerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-800">
                    {language === 'es' ? 'Reportes diarios' : 'Daily reports'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {language === 'es'
                      ? 'Recibir un resumen diario de ventas'
                      : 'Receive a daily sales summary'}
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.dailyReports}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, dailyReports: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-slate-800">
                    {language === 'es' ? 'Reportes semanales' : 'Weekly reports'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {language === 'es'
                      ? 'Recibir un resumen semanal con analiticas'
                      : 'Receive a weekly summary with analytics'}
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Hours */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.businessHours')}</CardTitle>
              <CardDescription>
                {language === 'es'
                  ? 'Define el horario de atencion de tu negocio'
                  : 'Define your business operating hours'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{language === 'es' ? 'Hora de apertura' : 'Opening time'}</Label>
                  <Input
                    type="time"
                    value={businessHours.start}
                    onChange={(e) => setBusinessHours({ ...businessHours, start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === 'es' ? 'Hora de cierre' : 'Closing time'}</Label>
                  <Input
                    type="time"
                    value={businessHours.end}
                    onChange={(e) => setBusinessHours({ ...businessHours, end: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>{language === 'es' ? 'Dias de operacion' : 'Operating days'}</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: 'monday', label: language === 'es' ? 'Lunes' : 'Monday' },
                    { key: 'tuesday', label: language === 'es' ? 'Martes' : 'Tuesday' },
                    { key: 'wednesday', label: language === 'es' ? 'Miercoles' : 'Wednesday' },
                    { key: 'thursday', label: language === 'es' ? 'Jueves' : 'Thursday' },
                    { key: 'friday', label: language === 'es' ? 'Viernes' : 'Friday' },
                    { key: 'saturday', label: language === 'es' ? 'Sabado' : 'Saturday' },
                    { key: 'sunday', label: language === 'es' ? 'Domingo' : 'Sunday' },
                  ].map((day) => (
                    <div
                      key={day.key}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-slate-700">{day.label}</span>
                      <Switch
                        checked={businessHours[day.key as keyof typeof businessHours] as boolean}
                        onCheckedChange={(checked) =>
                          setBusinessHours({ ...businessHours, [day.key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  {language === 'es'
                    ? 'El asistente de WhatsApp solo respondera automaticamente durante el horario de atencion configurado.'
                    : 'The WhatsApp assistant will only respond automatically during configured business hours.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
