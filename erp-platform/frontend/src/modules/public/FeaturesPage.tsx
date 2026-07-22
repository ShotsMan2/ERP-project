import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, Tag, Button } from 'antd';
import {
  ArrowRightOutlined, DollarOutlined, TeamOutlined, ShoppingCartOutlined,
  ProjectOutlined, BarChartOutlined, GlobalOutlined, SafetyOutlined,
  CloudOutlined, ThunderboltOutlined, FileTextOutlined, ApiOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const modules = [
  {
    icon: <DollarOutlined />, title: 'Finans & Muhasebe',
    features: ['Çift Taraflı Defter Kaydı', 'Fatura Yönetimi (AR/AP)', 'Banka Mutabakatı', 'Bütçe Planlama', 'Vergi Motoru', 'Finansal Raporlama'],
  },
  {
    icon: <TeamOutlined />, title: 'İnsan Kaynakları',
    features: ['Personel Veritabanı', 'Devam Takibi', 'İzin Yönetimi', 'Bordro Hesaplama', 'Performans Değerlendirme', 'İşe Alım Süreci'],
  },
  {
    icon: <ShoppingCartOutlined />, title: 'Envanter & Depo',
    features: ['Çoklu Depo Desteği', 'Stok Seviye Takibi', 'Transfer Yönetimi', 'Sayım İşlemleri', 'Düşük Stok Uyarıları', 'Barkod Desteği'],
  },
  {
    icon: <ProjectOutlined />, title: 'Proje Yönetimi',
    features: ['Proje Planlama', 'Görev Atama', 'Gantt Şeması', 'Zaman Takibi', 'Kaynak Yönetimi', 'Ekip İşbirliği'],
  },
  {
    icon: <BarChartOutlined />, title: 'Raporlama & Analitik',
    features: ['Özelleştirilebilir Paneller', 'Gerçek Zamanlı Veriler', 'Grafiksel Raporlar', 'Zamanlanmış Raporlar', 'Excel/PDF Dışa Aktarım', 'Ad-Hoc Analiz'],
  },
  {
    icon: <SafetyOutlined />, title: 'Güvenlik & Uyum',
    features: ['RBAC Yetkilendirme', 'MFA Doğrulama', 'Denetim Günlükleri', 'Veri Şifreleme', 'GDPR Uyumluluğu', 'Oturum Yönetimi'],
  },
  {
    icon: <ThunderboltOutlined />, title: 'Otomasyon',
    features: ['İş Akışı Motoru', 'E-posta Bildirimleri', 'Kural Tabanlı Tetikleyiciler', 'Zamanlanmış Görevler', 'Onay Süreçleri', 'Webhook Desteği'],
  },
  {
    icon: <ApiOutlined />, title: 'API & Entegrasyon',
    features: ['REST API', 'WebSocket Desteği', 'Webhook', 'Hazır Entegrasyonlar', 'Dökümantasyon', 'SDK Desteği'],
  },
  {
    icon: <GlobalOutlined />, title: 'Çoklu Dil & Bölge',
    features: ['Türkçe, İngilizce, Almanca', 'Çoklu Para Birimi', 'Bölgesel Ayarlar', 'Vergi Yapılandırması', 'Rapor Dili Seçimi', 'Tarih/Saat Formatı'],
  },
];

export default function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="py-24 px-4 bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Tag className="mb-4 px-4 py-1 rounded-full bg-indigo-500/20 border-indigo-400/30 text-indigo-300">ÖZELLİKLER</Tag>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Kurumsal Düzeyde Özellikler</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">9 entegre modül, 50+ özellik ile işletmenizin tüm ihtiyaçlarını karşılar.</p>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {modules.map((mod, i) => (
            <Row key={i} gutter={[48, 48]} className={`mb-16 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`} align="middle">
              <Col xs={24} lg={10}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl mb-6">
                  {mod.icon}
                </div>
                <Title level={3} className="mb-4">{mod.title}</Title>
                <div className="space-y-3">
                  {mod.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span className="text-gray-600">{f}</span>
                    </div>
                  ))}
                </div>
              </Col>
              <Col xs={24} lg={14}>
                <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-4xl mx-auto mb-4">
                      {mod.icon}
                    </div>
                    <Title level={4} className="text-indigo-600">{mod.title}</Title>
                    <Paragraph className="text-gray-500">{mod.features.length} özellik</Paragraph>
                  </div>
                </div>
              </Col>
            </Row>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-indigo-900 to-black text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Tüm Özellikleri Keşfedin</h2>
          <p className="text-lg text-gray-400 mb-8">14 gün ücretsiz deneme ile tüm özellikleri test edin.</p>
          <Button type="primary" size="large" shape="round" className="h-12 px-8"
            onClick={() => navigate('/auth')}>
            Ücretsiz Başlayın <ArrowRightOutlined />
          </Button>
        </div>
      </section>
    </div>
  );
}
