import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Tag, Button, Space } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const posts: Record<string, { title: string; content: string; category: string; date: string; readTime: string; author: string }> = {
  'erp-digital-transformation': {
    title: 'Dijital Dönüşümde ERP\'nin Rolü',
    category: 'ERP Stratejisi', date: '15 Temmuz 2026', readTime: '5 dk', author: 'Ali Uysal',
    content: `Dijital dönüşüm, işletmelerin rekabet avantajı elde etmek için teknolojiyi iş süreçlerine entegre etme sürecidir. Bu dönüşümün merkezinde ise ERP (Kurumsal Kaynak Planlama) sistemleri yer alır.

## Neden ERP?

ERP sistemleri, işletmelerin farklı departmanlarını tek bir platformda birleştirerek veri akışını optimize eder. Finans, İK, envanter, satış ve üretim gibi tüm süreçler entegre bir şekilde yönetilir.

## Dijital Dönüşümün Temel Bileşenleri

1. **Veri Entegrasyonu**: Tüm verilerin tek bir kaynakta toplanması
2. **Süreç Otomasyonu**: Tekrarlayan işlerin otomatikleştirilmesi
3. **Gerçek Zamanlı Raporlama**: Anlık veri analizi ve karar desteği
4. **Bulut Altyapısı**: Her yerden erişim ve ölçeklenebilirlik
5. **Mobil Erişim**: Sahada çalışan ekipler için mobil çözümler

## Başarılı Bir Dönüşüm İçin İpuçları

- Net hedefler belirleyin
- Doğru ERP partnerini seçin
- Çalışanlarınızı sürece dahil edin
- Aşamalı geçiş yapın
- Sürekli iyileştirme kültürü oluşturun`,
  },
};

export default function BlogDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const post = id ? posts[id] : null;

  if (!post) {
    return (
      <div className="pt-24 px-4 text-center">
        <Title level={3}>Yazı bulunamadı</Title>
        <Button onClick={() => navigate('/blog')}>Blog'a Dön</Button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/blog')} className="mb-6">
          Blog'a Dön
        </Button>
        <Tag className="mb-4 text-xs rounded-full">{post.category}</Tag>
        <Title level={1} className="mb-4 leading-tight text-4xl">{post.title}</Title>
        <Space className="text-gray-400 text-sm mb-8" size="large">
          <span><UserOutlined className="mr-1" />{post.author}</span>
          <span><CalendarOutlined className="mr-1" />{post.date}</span>
          <span><ClockCircleOutlined className="mr-1" />{post.readTime}</span>
        </Space>
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </div>
    </div>
  );
}
