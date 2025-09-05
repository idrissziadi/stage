import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Link, 
  Home, 
  Mail, 
  Share2, 
  HelpCircle 
} from 'lucide-react';

interface MinistryFooterProps {
  onHelpClick?: () => void;
}

const MinistryFooter: React.FC<MinistryFooterProps> = ({ onHelpClick }) => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
      <div className="w-full">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-center">
          <h2 className="text-2xl font-bold mb-2 font-arabic">وزارة التكوين والتعليم المهنيين</h2>
          <p className="text-lg opacity-90 font-arabic">نظام إدارة التدريب والتكوين المهني</p>
        </div>
        
        {/* Content Grid */}
        <div className="p-6 grid gap-6 md:grid-cols-3 max-w-7xl mx-auto">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 font-arabic">
              <div className="theme-transition-colors w-8 h-8 bg-card/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              حول النظام
            </h3>
            <p className="text-sm opacity-90 leading-relaxed font-arabic">
              منصة شاملة لإدارة التكوين والتعليم المهني، تهدف إلى تطوير المهارات وتحسين جودة التعليم المهني في الجزائر
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-card/20 text-white border-white/30 font-arabic">إدارة الدروس</Badge>
              <Badge variant="secondary" className="bg-card/20 text-white border-white/30 font-arabic">متابعة الطلاب</Badge>
              <Badge variant="secondary" className="bg-card/20 text-white border-white/30 font-arabic">تقييم المذكرات</Badge>
            </div>
          </div>
          
          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 font-arabic">
              <div className="theme-transition-colors w-8 h-8 bg-card/20 rounded-full flex items-center justify-center">
                <Link className="w-4 h-4" />
              </div>
              روابط مفيدة
            </h3>
            <div className="space-y-3">
              <a 
                href="https://mfp.gov.dz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:bg-card/10 p-2 rounded-lg transition-colors font-arabic"
              >
                <div className="theme-transition-colors w-6 h-6 bg-card/20 rounded-full flex items-center justify-center">
                  <Home className="w-3 h-3" />
                </div>
                الموقع الرسمي للوزارة
              </a>
              <a 
                href="https://mail.mfep.gov.dz/hpronto/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:bg-card/10 p-2 rounded-lg transition-colors font-arabic"
              >
                <div className="theme-transition-colors w-6 h-6 bg-card/20 rounded-full flex items-center justify-center">
                  <Mail className="w-3 h-3" />
                </div>
                البريد الإلكتروني
              </a>
              {onHelpClick && (
                <button 
                  onClick={onHelpClick}
                  className="theme-transition-colors flex items-center gap-3 text-sm hover:bg-card/10 p-2 rounded-lg transition-colors w-full text-right font-arabic"
                >
                  <div className="theme-transition-colors w-6 h-6 bg-card/20 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-3 h-3" />
                  </div>
                  المساعدة والدعم
                </button>
              )}
            </div>
          </div>
          
          {/* Social Media Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 font-arabic">
              <div className="theme-transition-colors w-8 h-8 bg-card/20 rounded-full flex items-center justify-center">
                <Share2 className="w-4 h-4" />
              </div>
              تابعنا على
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <a 
                href="https://www.facebook.com/GOVMFEPDZ/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:bg-card/10 p-3 rounded-lg transition-colors font-arabic"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                فيسبوك
              </a>
              <a 
                href="https://www.instagram.com/mfepgovdz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:bg-card/10 p-3 rounded-lg transition-colors font-arabic"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                إنستغرام
              </a>
              <a 
                href="https://x.com/mfepgov" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:bg-card/10 p-3 rounded-lg transition-colors font-arabic"
              >
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                تويتر
              </a>
              <a 
                href="https://www.youtube.com/channel/UCMPdsYQSn3eOOBz0vyTv4-A" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:bg-card/10 p-3 rounded-lg transition-colors font-arabic"
              >
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                يوتيوب
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="bg-black/20 px-6 py-4 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm max-w-7xl mx-auto">
            <div className="flex items-center gap-4 font-arabic">
              <span> وزارة التكوين والتعليم المهنيين </span>
            </div>
            <div className="flex items-center gap-4 text-xs opacity-80">
              <span>Version 1.0</span>
              <span>•</span>
              <span className="font-arabic"> © 2025 - جميع دروس محفوظة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinistryFooter;