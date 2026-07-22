import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Card, Typography, Space, Tag } from 'antd';
import {
  ArrowRightOutlined, PlayCircleOutlined, CheckCircleOutlined,
  RocketOutlined, SafetyOutlined, ThunderboltOutlined, TeamOutlined,
  GlobalOutlined, BarChartOutlined, CloudOutlined,
  DollarOutlined, ShoppingCartOutlined, ProjectOutlined,
  SettingOutlined, CustomerServiceOutlined, FileTextOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const stats = [
  { value: '10K+', label: 'Aktif Kullanıcı' },
  { value: '500+', label: 'Kurumsal Müşteri' },
  { value: '99.9%', label: 'Sistem Çalışma Süresi' },
  { value: '50M+', label: 'İşlenen İşlem' },
];

const features = [
  { icon: <DollarOutlined />, title: 'Finans & Muhasebe', desc: 'Çift taraflı defter kaydı, fatura yönetimi, bütçe takibi ve finansal raporlama.' },
  { icon: <TeamOutlined />, title: 'İnsan Kaynakları', desc: 'Personel yönetimi, bordro, devam takibi, izin yönetimi ve performans değerlendirme.' },
  { icon: <ShoppingCartOutlined />, title: 'Envanter & Depo', desc: 'Çoklu depo yönetimi, stok takibi, transferler ve sayım işlemleri.' },
  { icon: <ProjectOutlined />, title: 'Proje Yönetimi', desc: 'Proje planlama, görev takibi, Gantt şeması ve zaman yönetimi.' },
  { icon: <BarChartOutlined />, title: 'Raporlama & Analitik', desc: 'Özelleştirilebilir raporlar, gerçek zamanlı gösterge panelleri ve veri görselleştirme.' },
  { icon: <GlobalOutlined />, title: 'Müşteri Portalı', desc: 'Müşteri ve tedarikçiler için özel portallar, self-servis işlemler.' },
  { icon: <SafetyOutlined />, title: 'Güvenlik & Uyumluluk', desc: 'RBAC yetkilendirme, MFA doğrulama, denetim günlükleri ve veri şifreleme.' },
  { icon: <CloudOutlined />, title: 'Bulut & Mobil', desc: 'Bulut tabanlı altyapı, mobil uyumlu arayüz ve API entegrasyonları.' },
  { icon: <ThunderboltOutlined />, title: 'Otomasyon & İş Akışı', desc: 'Otomatik iş akışları, e-posta bildirimleri ve akıllı kurallar.' },
];

const pricingPlans = [
  {
    name: 'Başlangıç', price: '0', period: '/ay', desc: 'Küçük işletmeler için temel özellikler',
    features: ['5 Kullanıcı', 'Temel Muhasebe', 'Personel Yönetimi', 'E-posta Desteği'],
    color: 'gray',
  },
  {
    name: 'Profesyonel', price: '149', period: '/ay', desc: 'Büyüyen işletmeler için tam çözüm',
    features: ['25 Kullanıcı', 'Tüm Modüller', 'API Erişimi', 'Öncelikli Destek', 'Özel Raporlar'],
    color: 'indigo', popular: true,
  },
  {
    name: 'Kurumsal', price: '399', period: '/ay', desc: 'Büyük ölçekli işletmeler için kurumsal',
    features: ['Sınırsız Kullanıcı', 'Özel Entegrasyonlar', 'SLA Garantisi', '7/24 Destek', 'Özel Eğitim', 'Dedike Sunucu'],
    color: 'purple',
  },
];

const testimonials = [
  { name: 'Ahmet Yılmaz', role: 'CEO, TechCorp', text: 'EnterprisePlatform sayesinde tüm operasyonumuzu tek platformda birleştirdik. Verimliliğimiz %40 arttı.' },
  { name: 'Ayşe Demir', role: 'Finans Müdürü, GlobalTrade', text: 'Finans modülü tam bir mucize. Raporlama ve bütçe takibi artık çok kolay.' },
  { name: 'Mehmet Kaya', role: 'Operasyon Direktörü, LogiCo', text: 'Envanter ve depo yönetimi modülü iş süreçlerimizi tamamen dönüştürdü.' },
];

const faqs = [
  { q: 'Platformu kullanmak için teknik bilgi gerekli mi?', a: 'Hayır, kullanıcı dostu arayüzümüz sayesinde teknik bilgi gerektirmeden tüm özellikleri kullanabilirsiniz.' },
  { q: 'Verilerim güvende mi?', a: 'Evet, tüm verileriniz AES-256 ile şifrelenir, düzenli yedeklenir ve GDPR uyumlu sunucularda saklanır.' },
  { q: 'Mevcut sistemlerimle entegre edebilir miyim?', a: 'Evet, REST API, Webhook ve hazır entegrasyonlarla mevcut sistemlerinizle kolayca entegre olabilirsiniz.' },
  { q: 'Mobil cihazlardan kullanabilir miyim?', a: 'Evet, platformumuz tamamen responsive tasarıma sahiptir ve tüm mobil cihazlardan erişilebilir.' },
];

function useIntersection(ref: React.RefObject<HTMLElement | null>, options?: IntersectionObserverInit) {
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('animate-fade-in'); },
      { threshold: 0.1, ...options }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);
}

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useIntersection(ref);
  return <div ref={ref} className={`opacity-0 transition-all duration-700 translate-y-8 ${className}`}>{children}</div>;
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-black">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse animation-delay-2000" />
          <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse animation-delay-4000" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMjBMMjAgMjAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9zdmc+')] opacity-30" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center pt-24 pb-16">
          <Tag className="mb-6 px-4 py-1 rounded-full bg-indigo-500/20 border-indigo-400/30 text-indigo-300 text-xs font-medium">
            🚀 Yeni Nesil ERP Platformu
          </Tag>
          <h1 className="text-4xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
            İşletmenizi
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 block mt-2">
              Tek Platformda Yönetin
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Finans, İK, envanter, satış, proje yönetimi ve daha fazlası. 
            Tüm iş süreçlerinizi entegre bir platformda birleştirin, verimliliğinizi katlayın.
          </p>
          <Space size="large" className="flex-wrap justify-center">
            <Button type="primary" size="large" shape="round" className="h-12 px-8 text-base font-semibold shadow-lg shadow-indigo-500/30"
              onClick={() => navigate('/auth')}>
              Ücretsiz Başlayın <ArrowRightOutlined />
            </Button>
            <Button size="large" shape="round" className="h-12 px-8 text-base !bg-white/10 !text-white !border-white/20 hover:!bg-white/20"
              icon={<PlayCircleOutlined />}>
              Demo İzleyin
            </Button>
          </Space>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 px-4 bg-white" id="features">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Tag className="mb-4 text-xs font-semibold">ÖZELLİKLER</Tag>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              İşletmeniz İhtiyacı Olan Her Şey
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              9 entegre modül ile tüm iş süreçlerinizi uçtan uca yönetin.
            </p>
          </AnimatedSection>

          <Row gutter={[24, 24]}>
            {features.map((f, i) => (
              <Col xs={24} sm={12} md={8} key={i}>
                <AnimatedSection>
                  <Card className="h-full border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl" bordered={false}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl mb-5">
                      {f.icon}
                    </div>
                    <Title level={5} className="mb-2">{f.title}</Title>
                    <Paragraph className="text-gray-500 mb-0">{f.desc}</Paragraph>
                  </Card>
                </AnimatedSection>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ─── WHY SECTION ─── */}
      <section className="py-24 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <AnimatedSection>
                <Tag className="mb-4 text-xs font-semibold">NEDEN BİZ?</Tag>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Rakipsiz Performans ve Güvenlik
                </h2>
                <Paragraph className="text-gray-500 text-lg mb-8">
                  EnterprisePlatform, en son teknolojilerle inşa edilmiş, kurumsal düzeyde bir ERP çözümüdür.
                </Paragraph>
                <Space direction="vertical" size="middle" className="w-full">
                  {[
                    { icon: <ThunderboltOutlined />, title: 'Yüksek Performans', desc: 'Asenkron mimari ve önbellekleme ile anlık yanıt süreleri.' },
                    { icon: <SafetyOutlined />, title: 'Kurumsal Güvenlik', desc: 'RBAC, MFA, denetim günlükleri ve uçtan uca şifreleme.' },
                    { icon: <SettingOutlined />, title: 'Tam Özelleştirme', desc: 'Kendi iş akışlarınızı oluşturun, özel raporlar tasarlayın.' },
                    { icon: <CustomerServiceOutlined />, title: '7/24 Destek', desc: 'Uzman ekibimiz her zaman yanınızda.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <Text strong className="text-gray-900">{item.title}</Text>
                        <Paragraph className="text-gray-500 text-sm mb-0">{item.desc}</Paragraph>
                      </div>
                    </div>
                  ))}
                </Space>
              </AnimatedSection>
            </Col>
            <Col xs={24} lg={12}>
              <AnimatedSection>
                <div className="relative">
                  <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10 absolute inset-0 transform rotate-6" />
                  <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 absolute inset-0 transform -rotate-3" />
                  <div className="relative w-full aspect-[4/3] rounded-2xl bg-white shadow-2xl p-8 flex items-center justify-center border border-gray-100">
                    <div className="text-center">
                      <RocketOutlined className="text-8xl text-indigo-500 mb-4" />
                      <Title level={3}>Modern Altyapı</Title>
                      <Paragraph className="text-gray-500">FastAPI + React + PostgreSQL + Redis</Paragraph>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </Col>
          </Row>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-24 px-4 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Tag className="mb-4 text-xs font-semibold">FİYATLANDIRMA</Tag>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              İşletmenize Uygun Plan
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              14 gün ücretsiz deneme. Kredi kartı gerekmez.
            </p>
          </AnimatedSection>

          <Row gutter={[24, 24]} justify="center">
            {pricingPlans.map((plan, i) => (
              <Col xs={24} md={8} key={i}>
                <AnimatedSection>
                  <Card className={`h-full relative border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 rounded-2xl ${
                    plan.popular ? 'border-indigo-500 shadow-lg shadow-indigo-200' : 'border-gray-100'
                  }`} bordered={false}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                        POPÜLER
                      </div>
                    )}
                    <div className="text-center mb-6 pt-2">
                      <Title level={4} className="mb-1">{plan.name}</Title>
                      <Paragraph className="text-gray-500 mb-4">{plan.desc}</Paragraph>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-400">{plan.period}</span>
                      </div>
                    </div>
                    <div className="space-y-3 mb-8">
                      {plan.features.map((f, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircleOutlined className="text-green-500" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      type={plan.popular ? 'primary' : 'default'}
                      size="large"
                      block
                      shape="round"
                      className={plan.popular ? '' : '!border-gray-300 !text-gray-700'}
                      onClick={() => navigate('/auth')}
                    >
                      {plan.price === '0' ? 'Ücretsiz Başla' : 'Hemen Başla'}
                    </Button>
                  </Card>
                </AnimatedSection>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Tag className="mb-4 text-xs font-semibold">MÜŞTERİ YORUMLARI</Tag>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
          </AnimatedSection>

          <Row gutter={[24, 24]} justify="center">
            {testimonials.map((t, i) => (
              <Col xs={24} md={8} key={i}>
                <AnimatedSection>
                  <Card className="h-full border border-gray-100 hover:shadow-xl transition-all duration-300 rounded-2xl" bordered={false}>
                    <div className="flex gap-1 text-yellow-400 mb-4">
                      {[...Array(5)].map((_, j) => <span key={j}>⭐</span>)}
                    </div>
                    <Paragraph className="text-gray-600 italic mb-6">"{t.text}"</Paragraph>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <Text strong className="block text-sm">{t.name}</Text>
                        <Text className="text-xs text-gray-400">{t.role}</Text>
                      </div>
                    </div>
                  </Card>
                </AnimatedSection>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <Tag className="mb-4 text-xs font-semibold">SSS</Tag>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Sıkça Sorulan Sorular
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <AnimatedSection key={i}>
                <Card className="border border-gray-100 hover:shadow-md transition-all duration-300 rounded-xl" bordered={false}>
                  <Title level={5} className="mb-2 text-gray-900">{faq.q}</Title>
                  <Paragraph className="text-gray-500 mb-0">{faq.a}</Paragraph>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-4 bg-gradient-to-br from-indigo-900 via-slate-900 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full filter blur-[128px]" />
          <div className="absolute bottom-[-30%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full filter blur-[128px]" />
        </div>

        <AnimatedSection className="relative z-10 max-w-4xl mx-auto text-center">
          <Tag className="mb-6 px-4 py-1 rounded-full bg-indigo-500/20 border-indigo-400/30 text-indigo-300 text-xs font-medium">
            🚀 HEMEN BAŞLAYIN
          </Tag>
          <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 leading-tight">
            İşletmenizi Dönüştürmeye<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Bugün Başlayın
            </span>
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            14 gün ücretsiz deneme. Kredi kartı gerekmez. Taahhüt yok.
          </p>
          <Space size="large" className="flex-wrap justify-center">
            <Button type="primary" size="large" shape="round" className="h-12 px-10 text-base font-semibold shadow-lg shadow-indigo-500/30"
              onClick={() => navigate('/auth')}>
              Ücretsiz Başlayın <ArrowRightOutlined />
            </Button>
            <Button size="large" shape="round" className="h-12 px-8 !bg-white/10 !text-white !border-white/20"
              onClick={() => navigate('/contact')}>
              Satış Ekibiyle Görüşün
            </Button>
          </Space>
        </AnimatedSection>
      </section>
    </div>
  );
}
