import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ArrowRight, ExternalLink } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  time: string;
  category: string;
  isImportant?: boolean;
  link?: string;
}

interface NewsSectionProps {
  news: NewsItem[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % news.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [news.length]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">الأخبار والتحديثات</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ابق على اطلاع بأحدث الأخبار والتحديثات في منصة الجودة
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured News */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-3xl p-8 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center space-x-3 space-x-reverse mb-4">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      {news[currentNewsIndex]?.category}
                    </span>
                    {news[currentNewsIndex]?.isImportant && (
                      <span className="bg-red-500 px-3 py-1 rounded-full text-sm font-medium">
                        مهم
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 leading-tight">
                    {news[currentNewsIndex]?.title}
                  </h3>
                  
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    {news[currentNewsIndex]?.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 space-x-reverse text-blue-100">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{news[currentNewsIndex]?.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{news[currentNewsIndex]?.time}</span>
                      </div>
                    </div>
                    
                    {news[currentNewsIndex]?.link && (
                      <motion.a
                        href={news[currentNewsIndex].link}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 space-x-reverse"
                      >
                        <span>اقرأ المزيد</span>
                        <ExternalLink className="w-4 h-4" />
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* News List */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center lg:text-right"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">أخبار أخرى</h3>
            </motion.div>
            
            {news.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ x: -10 }}
                className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center space-x-3 space-x-reverse text-sm text-gray-500">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                </div>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                عرض جميع الأخبار
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
