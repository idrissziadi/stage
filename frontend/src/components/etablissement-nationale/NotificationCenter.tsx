import { useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi';
import { formatDate } from '@/utils/formatDate';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Bell, CheckCircle, XCircle, FileText } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

const NotificationCenter = () => {
  const { userProfile } = useAuthApi();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.id_etab_nationale) {
      fetchNotifications();
    }
  }, [userProfile]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'programme_submitted',
          title: 'برنامج جديد مقدم للمراجعة',
          message: 'تم تقديم برنامج "تطوير تطبيقات الويب" من مؤسسة تكوين الجزائر العاصمة',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: '2',
          type: 'programme_approved',
          title: 'تم اعتماد برنامج تدريبي',
          message: 'تم اعتماد برنامج "قواعد البيانات المتقدمة" من مؤسسة تكوين وهران',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true
        },
        {
          id: '3',
          type: 'programme_rejected',
          title: 'تم رفض برنامج تدريبي',
          message: 'تم رفض برنامج "الذكاء الاصطناعي الأساسي" من مؤسسة تكوين قسنطينة',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          read: true
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الإشعارات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'programme_submitted':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'programme_approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'programme_rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <h1 className="text-2xl font-bold mb-2 font-arabic">مركز الإشعارات</h1>
              <p className="text-purple-100 font-arabic">إدارة وإطلاع على جميع الإشعارات والتنبيهات</p>
            </div>
            <div className="text-left">
              <div className="text-3xl font-bold">{unreadCount}</div>
              <div className="text-sm text-purple-100 font-arabic">إشعارات جديدة</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-arabic">لا توجد إشعارات</h3>
              <p className="text-gray-500 font-arabic">لا توجد إشعارات حالياً</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id} className={`transition-all duration-200 ${!notification.read ? 'border-r-4 border-r-blue-500 bg-blue-50/50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 font-arabic">{notification.title}</h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 font-arabic">{notification.message}</p>
                    <div className="text-xs text-gray-500 font-arabic">
                      {formatDate(notification.created_at)}
                    </div>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-700 font-arabic"
                    >
                      تحديد كمقروء
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
