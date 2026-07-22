import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, Tag, Input, Space } from 'antd';
import { SearchOutlined, CalendarOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const posts = [
  {
    id: 'erp-digital-transformation', category: 'ERP Stratejisi', date: '15 Temmuz 2026', readTime: '5 dk',
    title: 'Dijital Dönüşümde ERP\'nin Rolü', author: 'Ali Uysal',
    excerpt: 'İşletmelerin dijital dönüşüm yolculuğunda ERP sistemlerinin önemi ve başarılı bir dönüşüm için izlenmesi gereken adımlar.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'finance-automation', category: 'Finans', date: '10 Temmuz 2026', readTime: '4 dk',
    title: 'Finansal Süreçlerinizi Otomatize Edin', author: 'Zeynep Kaya',
    excerpt: 'Fatura yönetiminden banka mutabakatına kadar finansal süreçlerinizi nasıl otomatize edebileceğinizi keşfedin.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'hr-best-practices', category: 'İK', date: '5 Temmuz 2026', readTime: '6 dk',
    title: '2026\'da İK Yönetiminde En İyi Uygulamalar', author: 'Elif Yıldız',
    excerpt: 'Modern İK yönetiminde dikkat edilmesi gereken noktalar, dijital araçlar ve çalışan deneyimini iyileştirme stratejileri.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'inventory-optimization', category: 'Envanter', date: '28 Haziran 2026', readTime: '5 dk',
    title: 'Stok Yönetiminde Optimizasyon Teknikleri', author: 'Mehmet Demir',
    excerpt: 'Envanter maliyetlerini düşürmek ve stok seviyelerini optimize etmek için kanıtlanmış yöntemler.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'multi-warehouse-management', category: 'Lojistik', date: '20 Haziran 2026', readTime: '4 dk',
    title: 'Çoklu Depo Yönetimi Stratejileri', author: 'Ali Uysal',
    excerpt: 'Birden fazla deponuz varsa operasyonlarınızı nasıl daha verimli yönetebileceğinizi öğrenin.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'project-management-tips', category: 'Proje Yönetimi', date: '15 Haziran 2026', readTime: '7 dk',
    title: 'Proje Yönetiminde Başarının Sırları', author: 'Zeynep Kaya',
    excerpt: 'Projelerinizi zamanında ve bütçede teslim etmek için uygulayabileceğiniz pratik ipuçları.',
    gradient: 'from-rose-500 to-pink-500',
  },
];

export default function BlogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = posts.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <section className="py-24 px-4 bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Tag className="mb-4 px-4 py-1 rounded-full bg-indigo-500/20 border-indigo-400/30 text-indigo-300">BLOG</Tag>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">ERP Bilgi Merkezi</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">İşletmenizi büyütmek için ipuçları, stratejiler ve en iyi uygulamalar.</p>
          <Input
            size="large"
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Blog yazılarında ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xl rounded-full !bg-white/10 !border-white/20 text-white placeholder:text-gray-500"
          />
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[24, 24]}>
            {filtered.map((post) => (
              <Col xs={24} md={12} lg={8} key={post.id}>
                <Card
                  hoverable
                  className="h-full border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  bordered={false}
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <div className={`h-48 rounded-xl bg-gradient-to-br ${post.gradient} mb-4 flex items-center justify-center`}>
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{post.category[0]}</span>
                    </div>
                  </div>
                  <Tag className="mb-2 text-xs rounded-full">{post.category}</Tag>
                  <Title level={5} className="mb-2 leading-tight">{post.title}</Title>
                  <Paragraph className="text-gray-500 text-sm mb-4 line-clamp-2">{post.excerpt}</Paragraph>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <Space>
                      <UserOutlined /> <span>{post.author}</span>
                    </Space>
                    <Space>
                      <CalendarOutlined /> <span>{post.date}</span>
                      <ClockCircleOutlined /> <span>{post.readTime}</span>
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </div>
  );
}
