import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthApi } from '@/hooks/useAuthApi';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  BarChart3, 
  ArrowLeft, 
  ArrowRight,
  Play,
  Download,
  Mail,
  Phone,
  Globe,
  Shield,
  Clock,
  CheckCircle,
  Star,
  ChevronDown
} from 'lucide-react';
import {
  FeatureCard,
  TestimonialCarousel,
  StatsSection,
  MobileNavigation,
  FloatingParticles,
  AnimatedButton,
  ResourceCard,
  NewsSection,
  MagicTransition,
  SectionAnimation,
  MagicParticles,
  MagicScrollEffect,
  SectionTransition,
  AnimatedSection
} from '../components/landing-page';

  const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthApi();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const { scrollYProgress } = useScroll();
    
    // Form state for contact form
    const [contactForm, setContactForm] = useState({
      name: '',
      email: '',
      message: ''
    });
    
    // Handle platform access button
    const handlePlatformAccess = () => {
      if (user) {
        // User is logged in, redirect to dashboard
        navigate('/dashboard');
      } else {
        // User is not logged in, redirect to login page
        navigate('/auth');
      }
    };
    
    // Handle contact form submission
    const handleContactSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validation
      if (!contactForm.name || !contactForm.email || !contactForm.message) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
      }
      
      try {
        const response = await fetch('http://localhost:3000/simple-email/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: contactForm.name,
            email: contactForm.email,
            message: contactForm.message
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          alert('تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.');
          // Reset form
          setContactForm({
            name: '',
            email: '',
            message: ''
          });
        } else {
          alert('خطأ في إرسال الرسالة: ' + result.message);
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.');
      }
    };
    
    // Fonction de navigation animée vers les sections
    const scrollToSection = (sectionId: string) => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offsetTop = element.offsetTop - 80; // Ajuster pour la hauteur de la navigation
        
        // Animation de défilement fluide avec effet de rebond
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Effet visuel sur la section cible avec animation plus sophistiquée
        element.style.transform = 'scale(1.02) rotateY(2deg)';
        element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        
        // Animation de particules autour de la section
        createSectionParticles(element);
        
        setTimeout(() => {
          element.style.transform = 'scale(1) rotateY(0deg)';
          element.style.boxShadow = '';
        }, 500);
      }
    };
    
    // Fonction pour créer des particules autour de la section cible
    const createSectionParticles = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const particles = 20;
      
      for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full pointer-events-none z-50';
        particle.style.left = `${rect.left + Math.random() * rect.width}px`;
        particle.style.top = `${rect.top + Math.random() * rect.height}px`;
        
        document.body.appendChild(particle);
        
        // Animation de la particule
        const animation = particle.animate([
          { 
            transform: 'scale(0) rotate(0deg)',
            opacity: 0 
          },
          { 
            transform: 'scale(1) rotate(180deg)',
            opacity: 1 
          },
          { 
            transform: 'scale(0) rotate(360deg)',
            opacity: 0 
          }
        ], {
          duration: 1000,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        animation.onfinish = () => {
          document.body.removeChild(particle);
        };
      }
    };
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Users, value: 15000, label: 'طالب مسجل', suffix: '+' },
    { icon: BookOpen, value: 500, label: 'برنامج تعليمي', suffix: '+' },
    { icon: GraduationCap, value: 200, label: 'مؤسسة تعليمية', suffix: '+' },
    { icon: BarChart3, value: 98, label: 'معدل الرضا', suffix: '%' },
    { icon: Clock, value: 24, label: 'ساعة دعم فني', suffix: '/7' },
    { icon: CheckCircle, value: 99, label: 'معدل التوفر', suffix: '%' }
  ];

     const features = [
     {
       icon: BookOpen,
       title: 'إدارة الدروس',
       description: 'تنظيم شامل للمقررات والمواد التعليمية'
     },
     {
       icon: GraduationCap,
       title: 'متابعة الطلاب',
       description: 'تتبع تقدم الطلاب والبرامج الأكاديمية'
     },
     {
       icon: Users,
       title: 'تقييم المذكرات',
       description: 'نظام تقييم شامل للمذكرات والواجبات'
     },
     {
       icon: BarChart3,
       title: 'إحصائيات وتقارير',
       description: 'تحليلات شاملة للأداء الأكاديمي'
     }
   ];

  const testimonials = [
    {
      name: 'د. أحمد محمد',
      role: 'مدير التعليم العالي',
      content: 'هذه المنصة أحدثت ثورة في إدارة التعليم في بلادنا'
    },
    {
      name: 'أ. فاطمة الزهراء',
      role: 'معلمة',
      content: 'سهولة الاستخدام وفعالية في إدارة المقررات'
    },
    {
      name: 'محمد علي',
      role: 'طالب',
      content: 'منصة ممتازة تمكنني من الوصول للمواد بسهولة'
    }
  ];

  const faqs = [
    {
      question: 'كيف يمكنني الوصول للمنصة؟',
      answer: 'يمكنك الوصول للمنصة من خلال حسابك المؤسسي أو إنشاء حساب جديد'
    },
    {
      question: 'هل المنصة آمنة؟',
      answer: 'نعم، المنصة تستخدم أحدث تقنيات الأمان لحماية البيانات'
    },
    {
      question: 'كيف يمكنني الحصول على الدعم؟',
      answer: 'يمكنك التواصل مع فريق الدعم عبر البريد الإلكتروني أو الهاتف'
    }
  ];

  return (
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir="rtl">
       <FloatingParticles />
       <MagicParticles count={30} />
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 space-x-reverse"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
                             <span className="text-xl font-bold text-gray-900">وزارة التكوين والتعليم المهنيين</span>
            </motion.div>
            
                         <div className="hidden md:flex items-center space-x-8 space-x-reverse">
               {['الرئيسية', 'حول المنصة', 'البرامج', 'الموارد', 'اتصل بنا'].map((item) => (
                 <motion.button
                   key={item}
                   onClick={() => scrollToSection(item)}
                   whileHover={{ y: -2 }}
                   className="text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer bg-transparent border-none text-base"
                 >
                   {item}
                 </motion.button>
               ))}
             </div>
            
                         <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => navigate('/auth')}
                               className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all hidden md:block"
             >
               تسجيل الدخول
             </motion.button>
            
                         <MobileNavigation 
               navItems={['الرئيسية', 'حول المنصة', 'البرامج', 'الموارد', 'اتصل بنا']} 
               onNavigate={scrollToSection}
             />
          </div>
        </div>
      </motion.nav>

                                  {/* Hero Section */}
       <section id="الرئيسية">
          <MagicScrollEffect effect="morph" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
                         <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
               <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                 نظام إدارة التدريب
               </span>
               <br />
               والتكوين المهني
             </h1>
             
             <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
               منصة شاملة لإدارة التكوين والتعليم المهني، تهدف إلى تطوير المهارات وتحسين جودة التعليم المهني في الجزائر
             </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <AnimatedButton
                variant="primary"
                size="lg"
                onClick={handlePlatformAccess}
              >
                الوصول للمنصة
              </AnimatedButton>
              
              <AnimatedButton
                variant="outline"
                size="lg"
                icon={Play}
                onClick={() => console.log('Watch demo')}
              >
                شاهد العرض التوضيحي
              </AnimatedButton>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16"
          >
            <div className="relative w-full max-w-4xl mx-auto">
                             <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-200">
                {/* Première ligne - 3 statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stats.slice(0, 3).map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                         index === 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
                         index === 1 ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                         'bg-gradient-to-r from-rose-500 to-pink-600'
                       }`}>
                         <stat.icon className="w-8 h-8 text-white" />
                       </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {stat.value}{stat.suffix}
                      </div>
                      <div className="text-gray-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Deuxième ligne - 3 statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {stats.slice(3, 6).map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                      className="text-center"
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                         index === 0 ? 'bg-gradient-to-r from-violet-500 to-purple-600' :
                         index === 1 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                         'bg-gradient-to-r from-green-500 to-emerald-600'
                       }`}>
                         <stat.icon className="w-8 h-8 text-white" />
                       </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {stat.value}{stat.suffix}
                      </div>
                      <div className="text-gray-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </MagicScrollEffect>
      </section>

                    {/* Stats Section */}
        <AnimatedSection className="py-20 bg-white">
                  <StatsSection 
            stats={[
              { icon: Users, value: 15000, label: 'طالب مسجل', suffix: '+', color: 'bg-gradient-to-r from-emerald-500 to-teal-600' },
              { icon: BookOpen, value: 500, label: 'برنامج تعليمي', suffix: '+', color: 'bg-gradient-to-r from-amber-500 to-orange-600' },
              { icon: GraduationCap, value: 200, label: 'مؤسسة تعليمية', suffix: '+', color: 'bg-gradient-to-r from-rose-500 to-pink-600' },
              { icon: BarChart3, value: 98, label: 'معدل الرضا', suffix: '%', color: 'bg-gradient-to-r from-violet-500 to-purple-600' },
              { icon: Clock, value: 24, label: 'ساعة دعم فني', suffix: '/7', color: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
              { icon: CheckCircle, value: 99, label: 'معدل التوفر', suffix: '%', color: 'bg-gradient-to-r from-green-500 to-emerald-600' }
            ]}
          />
        </AnimatedSection>

               {/* Section Transition */}
        <SectionTransition variant="slide" />

              {/* About Section */}
       <motion.section 
         id="حول المنصة" 
         className="py-20 bg-white relative overflow-hidden"
         initial={{ opacity: 0, y: 100 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 1, ease: "easeOut" }}
         viewport={{ once: true, margin: "-100px" }}
       >
         {/* Background Animation */}
         <motion.div
           className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50"
           animate={{
             scale: [1, 1.1, 1],
             rotate: [0, 1, 0]
           }}
           transition={{
             duration: 20,
             repeat: Infinity,
             ease: "easeInOut"
           }}
         />
         <SectionAnimation variant="magnetic">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <motion.div
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
               className="text-center mb-16"
             >
               <h2 className="text-4xl font-bold text-gray-900 mb-6">حول النظام</h2>
               <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                 منصة شاملة لإدارة التكوين والتعليم المهني، تهدف إلى تطوير المهارات وتحسين جودة التعليم المهني في الجزائر
               </p>
             </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.1}
                                   color={index === 0 ? 'from-emerald-500 to-teal-600' : 
                        index === 1 ? 'from-amber-500 to-orange-600' : 
                        index === 2 ? 'from-rose-500 to-pink-600' : 
                        'from-violet-500 to-purple-600'}
                />
              ))}
            </div>
                   </div>
         </SectionAnimation>
       </motion.section>

               {/* Section Transition */}
        <SectionTransition variant="fade" />

                     {/* Benefits Section */}
        <AnimatedSection 
          id="البرامج" 
          className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50"
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">مزايا المنصة</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'للمعلمين',
                benefits: ['تبسيط العملية التعليمية', 'توفير الوقت والجهد', 'إدارة شاملة للمقررات'],
                                 color: 'from-emerald-500 to-teal-600'
              },
              {
                title: 'للطلاب',
                benefits: ['وصول سريع ومنظم', 'مواد تعليمية شاملة', 'تتبع التقدم الأكاديمي'],
                                 color: 'from-amber-500 to-orange-600'
              },
              {
                title: 'للإدارة',
                benefits: ['متابعة مركزية', 'تقارير مفصلة', 'إدارة فعالة للموارد'],
                                 color: 'from-rose-500 to-pink-600'
              }
            ].map((group, index) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, x: index === 1 ? 0 : (index === 0 ? -50 : 50) }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <h3 className={`text-2xl font-bold text-transparent bg-gradient-to-r ${group.color} bg-clip-text mb-6`}>
                  {group.title}
                </h3>
                <ul className="space-y-4">
                  {group.benefits.map((benefit, benefitIndex) => (
                                         <motion.li
                       key={benefit}
                       initial={{ opacity: 0, x: -20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       transition={{ duration: 0.5, delay: benefitIndex * 0.1 }}
                       viewport={{ once: true }}
                       className="flex items-center space-x-3 space-x-reverse"
                     >
                                              <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                         benefitIndex === 0 ? 'text-emerald-500' : 
                         benefitIndex === 1 ? 'text-amber-500' : 
                         'text-rose-500'
                       }`} />
                      <span className="text-gray-700">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
                 </div>
        </AnimatedSection>

               {/* Section Transition */}
        <SectionTransition variant="scale" />

       {/* Demo Section */}
      <AnimatedSection className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">عرض توضيحي للمنصة</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              اكتشف كيف تعمل المنصة من خلال هذا العرض التوضيحي المختصر
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center text-white">
                             <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Play className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-bold mb-4">شاهد المنصة في العمل</h3>
              <p className="text-gray-300 mb-8 text-lg">
                تعرف على الميزات والوظائف المتقدمة لمنصة الجودة
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                                 className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all"
              >
                                 تشغيل العرض التوضيحي
               </motion.button>
             </div>
           </motion.div>
                  </div>
       </AnimatedSection>

               {/* Section Transition */}
        <SectionTransition variant="morph" />

              {/* Testimonials */}
       <AnimatedSection className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">آراء المستخدمين</h2>
          </motion.div>
          
          <TestimonialCarousel 
            testimonials={testimonials.map((t, index) => ({ ...t, id: index }))}
            autoPlay={true}
            interval={6000}
          />
                 </div>
       </AnimatedSection>

               {/* Section Transition */}
        <SectionTransition variant="rotate" />

       {/* FAQ Section */}
      <AnimatedSection className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">الأسئلة الشائعة</h2>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
                 </div>
       </AnimatedSection>

               {/* Section Transition */}
        <SectionTransition variant="glitch" />

                                                           {/* Resources Section */}
         <AnimatedSection 
           id="الموارد" 
           className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50"
         >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
                         <h2 className="text-4xl font-bold text-gray-900 mb-6">الموارد والدليل</h2>
             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
               اكتشف مجموعة شاملة من الموارد والدلائل لمساعدتك في استخدام نظام إدارة التدريب والتكوين المهني
             </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ResourceCard
              title="دليل المستخدم الشامل"
              description="دليل مفصل يشرح جميع ميزات المنصة وكيفية استخدامها بكفاءة"
              type="guide"
              downloadUrl="/guides/user-manual.pdf"
            />
            
            <ResourceCard
              title="فيديو تعليمي للمعلمين"
              description="عرض توضيحي شامل لكيفية إدارة المقررات والبرامج التعليمية"
              type="video"
              onClick={() => console.log('Play video tutorial')}
            />
            
            <ResourceCard
              title="دليل إدارة البرامج"
              description="دليل متخصص لإدارة البرامج التعليمية والتتبع الأكاديمي"
              type="pdf"
              downloadUrl="/guides/program-management.pdf"
            />
            
            <ResourceCard
              title="فيديو تعليمي للطلاب"
              description="شرح مفصل لكيفية الوصول للمواد التعليمية وتتبع التقدم"
              type="video"
              onClick={() => console.log('Play student tutorial')}
            />
            
            <ResourceCard
              title="دليل التقارير والإحصائيات"
              description="كيفية استخدام أدوات التقارير والإحصائيات المتقدمة"
              type="guide"
              downloadUrl="/guides/reports-guide.pdf"
            />
            
                         <ResourceCard
               title="دليل الأمان والخصوصية"
               description="معلومات مهمة حول أمان البيانات وحماية الخصوصية"
               type="pdf"
               downloadUrl="/guides/security-privacy.pdf"
             />
           </div>
         </div>
       </AnimatedSection>

      {/* News Section */}
      <NewsSection 
        news={[
                     {
             id: 1,
             title: 'إطلاق النسخة الجديدة من نظام إدارة التدريب مع ميزات متقدمة',
             excerpt: 'نفخر بإطلاق النسخة المحدثة من نظام إدارة التدريب والتكوين المهني التي تتضمن تحسينات كبيرة في الأداء والميزات الجديدة',
             date: '15 يناير 2024',
             time: '10:00 ص',
             category: 'تحديثات',
             isImportant: true,
             link: '/news/platform-update-2024'
           },
           {
             id: 2,
             title: 'دورة تدريبية مجانية للمعلمين على استخدام النظام',
             excerpt: 'انضموا إلى دورة تدريبية شاملة لتعلم كيفية استخدام جميع ميزات نظام إدارة التدريب بكفاءة',
             date: '12 يناير 2024',
             time: '2:00 م',
             category: 'تدريب',
             link: '/news/teacher-training-2024'
           },
           {
             id: 3,
             title: 'إحصائيات جديدة: أكثر من 15,000 طالب مسجل في النظام',
             excerpt: 'تجاوز عدد الطلاب المسجلين في نظام إدارة التدريب 15,000 طالب، مما يعكس نجاح النظام',
             date: '10 يناير 2024',
             time: '9:00 ص',
             category: 'إحصائيات'
           },
           {
             id: 4,
             title: 'إضافة 50 برنامج تعليمي جديد للنظام',
             excerpt: 'تم إضافة مجموعة متنوعة من البرامج التعليمية الجديدة تغطي مختلف التخصصات المهنية',
             date: '8 يناير 2024',
             time: '11:00 ص',
             category: 'برامج تعليمية'
           },
           {
             id: 5,
             title: 'صيانة مجدولة للنظام يوم الأحد القادم',
             excerpt: 'سيتم إجراء صيانة روتينية للنظام يوم الأحد من الساعة 2:00 صباحاً حتى 6:00 صباحاً',
             date: '5 يناير 2024',
             time: '3:00 م',
             category: 'صيانة'
           }
                 ]}
       />

               {/* Section Transition */}
        <SectionTransition variant="slide" />

                                                           {/* Contact Section */}
         <AnimatedSection 
           id="اتصل بنا" 
           className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50"
         >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">اتصل بنا</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نحن هنا لمساعدتك. لا تتردد في التواصل معنا للحصول على الدعم
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                                                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                   <Mail className="w-6 h-6 text-white" />
                 </div>
               <div>
                 <div className="font-semibold text-gray-900">البريد الإلكتروني</div>
                 <div className="text-gray-600" dir="ltr">https://mail.mfep.gov.dz/hpronto/</div>
               </div>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                                                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                   <Phone className="w-6 h-6 text-white" />
                 </div>
               <div>
                 <div className="font-semibold text-gray-900">الهاتف</div>
                 <div className="text-gray-600" dir="ltr">+213 21 60 55 55</div>
               </div>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                                                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                   <Globe className="w-6 h-6 text-white" />
                 </div>
               <div>
                 <div className="font-semibold text-gray-900">الموقع</div>
                 <div className="text-gray-600" dir="ltr">https://mfp.gov.dz/</div>
               </div>
              </div>
            </motion.div>
            
            <motion.form
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
              onSubmit={handleContactSubmit}
            >
              <div>
                                 <input
                   type="text"
                   placeholder="الاسم الكامل"
                   value={contactForm.name}
                   onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                 />
              </div>
              <div>
                                 <input
                   type="email"
                   placeholder="البريد الإلكتروني"
                   value={contactForm.email}
                   onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                 />
              </div>
              <div>
                                 <textarea
                   rows={4}
                   placeholder="رسالتك"
                   value={contactForm.message}
                   onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                 ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                إرسال الرسالة
              </motion.button>
            </motion.form>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                               <span className="text-xl font-bold">وزارة التكوين والتعليم المهنيين</span>
             </div>
             <p className="text-gray-400">
               نظام إدارة التدريب والتكوين المهني
             </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-gray-400">
                {['الرئيسية', 'حول المنصة', 'البرامج', 'الموارد'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">الدعم</h3>
              <ul className="space-y-2 text-gray-400">
                {['مركز المساعدة', 'الدليل', 'اتصل بنا', 'الشكاوى'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
                         <div>
               <h3 className="text-lg font-semibold mb-4">تابعنا على</h3>
               <div className="grid grid-cols-2 gap-3">
                 <a 
                   href="https://www.facebook.com/GOVMFEPDZ/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm hover:bg-indigo-600 p-2 rounded-lg transition-colors"
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
                   className="flex items-center gap-2 text-sm hover:bg-indigo-600 p-2 rounded-lg transition-colors"
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
                   className="flex items-center gap-2 text-sm hover:bg-indigo-600 p-2 rounded-lg transition-colors"
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
                   className="flex items-center gap-2 text-sm hover:bg-indigo-600 p-2 rounded-lg transition-colors"
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
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 منصة الجودة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
