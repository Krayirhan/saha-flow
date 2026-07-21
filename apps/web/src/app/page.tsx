'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Wrench,
  MapPin,
  Camera,
  ClipboardCheck,
  FileText,
  BarChart3,
  ArrowRight,
  Check,
  Zap,
  Star,
  TrendingUp,
  Users,
  Clock,
  Shield,
  ChevronRight,
  Sparkles,
  Play,
  Pause,
  ChevronDown,
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [yearly, setYearly] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);
  const [paused, setPaused] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Animated grid background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_30%,transparent_70%)]" />
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary-500/10 blur-[120px]" />
      </div>

      {/* Nav */}
      <Nav scrolled={scrolled} />

      {/* Hero */}
      <Hero />

      {/* Trust */}
      <TrustBar />

      {/* Feature Showcase */}
      <FeatureShowcase activeFeature={activeFeature} setActiveFeature={setActiveFeature} />

      {/* Bento Benefits */}
      <BentoBenefits />

      {/* Stats */}
      <AnimatedStats />

      {/* How it works - sticky scroll */}
      <HowItWorks />

      {/* Testimonials */}
      <TestimonialMarquee paused={paused} setPaused={setPaused} />

      {/* Pricing */}
      <Pricing yearly={yearly} setYearly={setYearly} />

      {/* FAQ */}
      <FaqSection faqOpen={faqOpen} setFaqOpen={setFaqOpen} />

      {/* CTA */}
      <CtaSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

/* ── Nav ── */
function Nav({ scrolled }: { scrolled: boolean }) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-500/25">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Saha Flow</span>
        </div>
        <div className="hidden items-center gap-8 text-sm text-white/60 md:flex">
          <a href="#features" className="transition-colors hover:text-white">Özellikler</a>
          <a href="#how-it-works" className="transition-colors hover:text-white">Nasıl Çalışır?</a>
          <a href="#pricing" className="transition-colors hover:text-white">Fiyatlandırma</a>
          <a href="#faq" className="transition-colors hover:text-white">SSS</a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white sm:inline-flex"
          >
            Giriş Yap
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0A0A0B] shadow-lg shadow-white/10 transition-all hover:bg-white/90 hover:shadow-white/20"
          >
            Ücretsiz Başlayın
            <Sparkles className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

/* ── Hero ── */
function Hero() {
  return (
    <section className="relative z-10 overflow-hidden pb-20 pt-36">
      {/* Floating UI mockup cards */}
      <FloatingCards />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-white/60">Türkiye&apos;de 500+ servis firması tarafından kullanılıyor</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
              Saha ekibini
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-300 via-primary-400 to-blue-400 bg-clip-text text-transparent">
              ışık hızında yönet
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/50 sm:text-xl">
            İş emrinden servis raporuna tüm saha operasyonlarınızı uçtan uca yönetin.
            WhatsApp ve Excel karmaşasına son.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#0A0A0B] shadow-xl shadow-white/10 transition-all hover:bg-white/90 hover:shadow-white/20"
            >
              14 Gün Ücretsiz Deneyin
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-8 py-4 text-base font-medium text-white/70 backdrop-blur-sm transition-all hover:border-white/20 hover:text-white"
            >
              <Play className="h-5 w-5" />
              Özellikleri Keşfet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingCards() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -right-20 top-20 hidden rotate-6 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-sm sm:block lg:right-20 lg:top-28">
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-white/60">12 iş emri aktif</span>
        </div>
      </div>
      <div className="absolute -left-10 top-40 hidden rotate-[-4deg] rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-sm sm:block lg:left-16 lg:top-52">
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
          <MapPin className="h-3.5 w-3.5 text-primary-400" />
          <span className="text-xs text-white/60">3 teknisyen sahada</span>
        </div>
      </div>
      <div className="absolute right-10 top-64 hidden rotate-[2deg] rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-sm sm:block lg:right-40 lg:top-72">
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-primary-500" />
          <span className="text-xs text-white/60">%92 tamamlanma</span>
        </div>
      </div>
    </div>
  );
}

/* ── Trust Bar ── */
function TrustBar() {
  return (
    <section className="relative z-10 border-y border-white/5 bg-white/[0.02] py-10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-white/30">
          Güvenilir SaaS &bull; Altyapı ortaklarımız
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {['AWS Türkiye', 'Google Cloud', 'PostgreSQL', 'Docker', 'Cloudflare', 'GitHub'].map((logo) => (
            <span key={logo} className="text-lg font-semibold tracking-tight text-white/10 transition-colors hover:text-white/20">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Feature Showcase ── */
const features = [
  {
    icon: Wrench,
    title: 'Akıllı İş Emri Yönetimi',
    desc: 'Servis taleplerini tek tıkla iş emrine dönüştürün. Otomatik önceliklendirme ve akıllı teknisyen eşleştirme ile doğru işi doğru kişiye atayın.',
    color: 'from-primary-400 to-primary-600',
  },
  {
    icon: MapPin,
    title: 'Canlı Konum Takibi',
    desc: 'İşe başlama ve bitirme anında otomatik konum kaydı. Hangi teknisyenin nerede olduğunu anlık haritada görün. Rota optimizasyonu ile yakıt tasarrufu.',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    icon: Camera,
    title: 'Fotoğraflı Servis Kanıtı',
    desc: 'Öncesi-sonrası fotoğraf çekimi, otomatik zaman damgası ve konum etiketi. Tüm görseller şifreli ve KVKK uyumlu depoda saklanır.',
    color: 'from-amber-400 to-orange-500',
  },
  {
    icon: ClipboardCheck,
    title: 'Dijital Kontrol Listesi',
    desc: 'Her iş tipine özel kontrol listeleri oluşturun. Teknisyenler adım adım yönlendirilir, eksik işlem kalmaz. Yapılmadıkça sonraki adıma geçilmez.',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: FileText,
    title: 'Anlık Servis Raporu',
    desc: 'İş tamamlandığında müşteriye anında profesyonel PDF rapor gönderilir. Dijital imza, kullanılan malzemeler ve fotoğraflar raporda.',
    color: 'from-purple-400 to-violet-500',
  },
  {
    icon: BarChart3,
    title: 'Akıllı Dashboard',
    desc: 'Gelir, teknisyen performansı, tamamlanma oranları, müşteri memnuniyeti — hepsi gerçek zamanlı. Haftalık otomatik raporlar e-postanızda.',
    color: 'from-rose-400 to-pink-500',
  },
];

function FeatureShowcase({
  activeFeature,
  setActiveFeature,
}: {
  activeFeature: number;
  setActiveFeature: (i: number) => void;
}) {
  const f = features[activeFeature];
  const Icon = f.icon;

  return (
    <section id="features" className="relative z-10 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
            Özellikler
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Her şey tek platformda
          </h2>
          <p className="mt-4 text-white/40">
            Saha operasyonlarınızın her adımı için optimize edilmiş araçlar.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="mt-12 hidden flex-wrap justify-center gap-2 sm:flex">
          {features.map((feat, i) => (
            <button
              key={feat.title}
              onClick={() => setActiveFeature(i)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                i === activeFeature
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <feat.icon className="h-4 w-4" />
              {feat.title.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Feature detail */}
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className={`inline-flex rounded-2xl bg-gradient-to-br ${f.color} p-4 shadow-lg`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="mt-6 text-2xl font-bold">{f.title}</h3>
            <p className="mt-4 text-lg leading-relaxed text-white/50">{f.desc}</p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary-400 transition-colors hover:text-primary-300"
            >
              Hemen deneyin <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 opacity-50 blur" />
              <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0B] p-6 shadow-2xl">
                <MockUI feature={activeFeature} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockUI({ feature }: { feature: number }) {
  if (feature === 0)
    return (
      <div className="space-y-3">
        <div className="h-3 w-24 rounded bg-white/10" />
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
            <span className="text-sm">Klima arızası</span>
            <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-400">Bekliyor</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
            <span className="text-sm">Kombi bakım</span>
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">Tamamlandı</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-primary-500/10 px-3 py-2.5 ring-1 ring-primary-500/30">
            <span className="text-sm">Kamera kurulumu</span>
            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">Devam ediyor</span>
          </div>
        </div>
      </div>
    );
  if (feature === 1)
    return (
      <div className="space-y-3">
        <div className="mx-auto h-40 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 ring-1 ring-white/5">
          <div className="flex h-full items-center justify-center">
            <MapPin className="h-8 w-8 text-primary-400 animate-pulse" />
          </div>
        </div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-center text-xs text-white/40">
              Teknisyen {i + 1}: {['Sahada', 'Yolda', 'Müsait'][i]}
            </div>
          ))}
        </div>
      </div>
    );
  if (feature === 2)
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-lg bg-white/5 p-4 text-center">
          <span className="text-xs text-white/30">Öncesi</span>
          <div className="h-20 w-full rounded bg-red-500/10 ring-1 ring-red-500/20" />
        </div>
        <div className="flex flex-col items-center gap-1 rounded-lg bg-white/5 p-4 text-center">
          <span className="text-xs text-white/30">Sonrası</span>
          <div className="h-20 w-full rounded bg-green-500/10 ring-1 ring-green-500/20" />
        </div>
      </div>
    );
  return (
    <div className="flex h-40 items-center justify-center">
      <div className="space-y-1 text-center">
        <p className="font-mono text-2xl font-bold text-primary-400">%92</p>
        <p className="text-xs text-white/30">Tamamlanma Oranı</p>
      </div>
    </div>
  );
}

/* ── Bento Benefits ── */
const bentoItems = [
  { icon: Zap, title: '3x Daha Hızlı', desc: 'Manuel süreçlere kıyasla iş emri oluşturma ve atama süresi', stat: '3x', large: false },
  { icon: Shield, title: 'KVKK Uyumlu', desc: 'Tüm veriler şifreli, erişim logları tutulur, saklama politikaları otomatik', stat: '%100', large: false },
  { icon: Users, title: 'Ekip Yönetimi', desc: 'Teknisyenlerinizi, yetkilerini ve bölgelerini merkezi olarak yönetin', stat: '', large: true },
  { icon: Clock, title: '7/24 Erişim', desc: 'Mobil ve web\'den kesintisiz erişim, %99.9 uptime garantisi', stat: '99.9%', large: false },
  { icon: TrendingUp, title: 'Verimlilik Artışı', desc: 'Müşterilerimiz ortalama %40 operasyonel verimlilik artışı bildiriyor', stat: '+%40', large: false },
];

function BentoBenefits() {
  return (
    <section className="relative z-10 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bentoItems.map((item, i) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-white/[0.05] ${
                item.large ? 'sm:col-span-2 sm:row-span-2' : ''
              }`}
            >
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary-500/10 to-blue-500/10 blur-2xl transition-all group-hover:scale-150`} />
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                  <item.icon className="h-5 w-5 text-primary-400" />
                </div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                {item.stat && (
                  <p className="mt-3 text-3xl font-bold tracking-tight text-primary-400">{item.stat}</p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-white/40">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Animated Stats ── */
function AnimatedStats() {
  return (
    <section className="relative z-10 border-y border-white/5 bg-gradient-to-r from-primary-500/5 via-blue-500/5 to-primary-500/5 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 text-center sm:grid-cols-3">
          <StatCounter end={500} suffix="+" label="Aktif Firma" />
          <StatCounter end={3500} suffix="+" label="Günlük İş Emri" />
          <StatCounter end={98} suffix="%" label="Müşteri Memnuniyeti" />
        </div>
      </div>
    </section>
  );
}

function StatCounter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 2000;
          const step = Math.ceil(end / (duration / 16));
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, 16);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="space-y-2">
      <span className="text-5xl font-bold tracking-tight text-white">
        {count.toLocaleString()}{suffix}
      </span>
      <p className="text-sm text-white/30">{label}</p>
    </div>
  );
}

/* ── How It Works ── */
const steps = [
  {
    step: '01',
    title: 'Firma kaydı',
    desc: 'Dakikalar içinde hesabınızı oluşturun, teknisyenlerinizi ve yetkilerini tanımlayın.',
  },
  {
    step: '02',
    title: 'Müşteri ve cihaz ekleme',
    desc: 'Müşterilerinizi, adreslerini ve servis verdiğiniz cihazları kolayca kaydedin.',
  },
  {
    step: '03',
    title: 'İş emri ve atama',
    desc: 'Tek tıkla iş emri oluşturun, en uygun teknisyene otomatik atayın.',
  },
  {
    step: '04',
    title: 'Sahada uygulama',
    desc: 'Teknisyen mobilde işi başlatır, kontrol listesini doldurur, fotoğraf çeker.',
  },
  {
    step: '05',
    title: 'Onay ve rapor',
    desc: 'Müşteri dijital onay verir, sistem otomatik PDF servis raporu oluşturur.',
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Sticky side */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
              Nasıl Çalışır?
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              5 adımda<br />dijital dönüşüm
            </h2>
            <p className="mt-4 text-white/40">
              Kurulumdan ilk servis raporuna kadar her şey birkaç dakika.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0A0A0B] transition-all hover:bg-white/90"
            >
              Hemen Başlayın
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((s, i) => (
              <div key={s.step} className="group flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-bold text-primary-400 transition-all group-hover:border-primary-500/30 group-hover:bg-primary-500/10">
                    {s.step}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mt-2 h-full w-px bg-gradient-to-b from-white/10 to-transparent" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/40">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonial Marquee ── */
const testimonials = [
  {
    quote: 'Saha Flow sayesinde aylık 200+ servis raporunu manuel hazırlamaktan kurtulduk. Teknisyenlerimiz iş başına 25 dakika kazanıyor.',
    name: 'Ahmet Yılmaz',
    role: 'Teknik Servis Müdürü, İklimPlus',
  },
  {
    quote: 'WhatsApp gruplarından ve Excel dosyalarından kurtulduk. Artık hangi teknisyenin nerede olduğunu anlık görebiliyorum.',
    name: 'Mehmet Kaya',
    role: 'İşletme Sahibi, GüvenPark Sistemleri',
  },
  {
    quote: 'Müşterilerimiz dijital onay ve anlık rapor özelliğini çok sevdi. Profesyonel imajımız gözle görülür şekilde arttı.',
    name: 'Zeynep Demir',
    role: 'Operasyon Direktörü, BakımPro',
  },
  {
    quote: 'Kurulumu 1 saat sürdü, ekibimiz aynı gün kullanmaya başladı. Kullanıcı dostu arayüzü sayesinde eğitim ihtiyacı olmadı.',
    name: 'Can Öztürk',
    role: 'Genel Müdür, Serinlet Servis',
  },
  {
    quote: 'Offline çalışma özelliği bizim için hayat kurtarıcı. Bodrum katlarda, şantiyelerde çekim olmasa bile işlemler devam ediyor.',
    name: 'Elif Aksoy',
    role: 'Saha Koordinatörü, TeknoFix',
  },
];

function TestimonialMarquee({
  paused,
  setPaused,
}: {
  paused: boolean;
  setPaused: (p: boolean) => void;
}) {
  return (
    <section className="relative z-10 overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
            Müşteri Yorumları
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Servis firmaları neden Saha Flow&apos;u seçiyor?
          </h2>
        </div>
      </div>

      <div className="group mt-12" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className={`flex gap-6 ${paused ? '' : 'animate-marquee'}`}>
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="w-[380px] flex-shrink-0 rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:border-white/10"
            >
              <div className="flex gap-1 text-primary-400">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-white/60">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-blue-400 text-sm font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-white/30">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ── */
function Pricing({ yearly, setYearly }: { yearly: boolean; setYearly: (y: boolean) => void }) {
  const price = yearly ? 119 : 149;
  return (
    <section id="pricing" className="relative z-10 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
            Fiyatlandırma
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Basit, şeffaf, öngörülebilir
          </h2>
          <p className="mt-4 text-white/40">Gizli ücret yok. İstediğiniz zaman iptal edebilirsiniz.</p>
        </div>

        {/* Toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className={`text-sm ${!yearly ? 'text-white' : 'text-white/30'}`}>Aylık</span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative h-8 w-14 rounded-full transition-colors ${
              yearly ? 'bg-primary-500' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform ${
                yearly ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm ${yearly ? 'text-white' : 'text-white/30'}`}>
            Yıllık
            <span className="ml-1.5 rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
              %20 tasarruf
            </span>
          </span>
        </div>

        {/* Card */}
        <div className="mx-auto mt-10 max-w-lg">
          <div className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-all hover:border-primary-500/30">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-primary-500/20 to-transparent opacity-0 blur transition-opacity group-hover:opacity-100" />
            <div className="relative text-center">
              <h3 className="text-xl font-semibold">Profesyonel</h3>
              <div className="mt-6 flex items-baseline justify-center gap-1">
                <span className="text-6xl font-bold tracking-tight">₺{price}</span>
                <span className="text-lg text-white/30">/teknisyen/ay</span>
              </div>
              <p className="mt-2 text-sm text-white/30">Minimum 5 teknisyen &bull; {yearly ? 'Yıllık fatura' : 'Aylık fatura'}</p>
            </div>
            <ul className="relative mt-8 space-y-3">
              {[
                'Sınırsız iş emri',
                'Sınırsız müşteri ve cihaz kaydı',
                'Canlı konum takibi',
                'Fotoğraf ve dosya depolama (50 GB)',
                'Dijital kontrol listeleri',
                'PDF servis raporu',
                'Müşteri onayı ve dijital imza',
                'Dashboard ve raporlama',
                'Mobil uygulama (iOS ve Android)',
                'E-posta ve telefon desteği',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-white/50">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="relative mt-8">
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-[#0A0A0B] shadow-lg shadow-white/5 transition-all hover:bg-white/90"
              >
                14 Gün Ücretsiz Deneyin
                <Sparkles className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-center text-xs text-white/20">Kredi kartı gerekmez &bull; Kurulum desteği dahil</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ── */
const faqs = [
  { q: 'Deneme süresi sonunda ne olur?', a: '14 gün sonunda otomatik olarak ücretlendirilmezsiniz. Devam etmek isterseniz ödeme bilgisi girmeniz gerekir. İptal ederseniz verileriniz 30 gün daha saklanır.' },
  { q: 'Verilerim güvende mi?', a: 'Tüm veriler şifreli olarak saklanır. KVKK uyumluyuz. Veritabanı günlük yedeklenir. ISO 27001 sertifikalı altyapı kullanıyoruz.' },
  { q: 'Mobil uygulama hangi cihazlarda çalışır?', a: 'iOS 15+ ve Android 8+ işletim sistemli tüm cihazlarda çalışır. Tablet desteği de mevcuttur.' },
  { q: 'İnternet olmayan yerlerde çalışır mı?', a: 'Evet. Mobil uygulama çevrimdışı çalışabilir. İşlemler internet gelince otomatik senkronize olur.' },
  { q: 'Entegrasyon desteği var mı?', a: 'Muhasebe yazılımları, ERP sistemleri ve e-fatura entegrasyonları için REST API sunuyoruz. Webhook desteği mevcuttur.' },
];

function FaqSection({
  faqOpen,
  setFaqOpen,
}: {
  faqOpen: number | null;
  setFaqOpen: (i: number | null) => void;
}) {
  return (
    <section id="faq" className="relative z-10 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">SSS</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Sıkça sorulanlar</h2>
        </div>
        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:border-white/10"
            >
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-white/30 transition-transform ${
                    faqOpen === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  faqOpen === i ? 'max-h-40 pb-5' : 'max-h-0'
                }`}
              >
                <p className="px-6 text-sm leading-relaxed text-white/40">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function CtaSection() {
  return (
    <section className="relative z-10 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500/20 via-blue-500/10 to-primary-500/10 p-px">
          <div className="relative rounded-3xl bg-[#0A0A0B] px-8 py-16 text-center">
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-500/20 blur-[100px]" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Saha operasyonlarınızı<br />bugün dijitalleştirin
              </h2>
              <p className="mt-4 text-white/40">
                İlk 14 gün ücretsiz. Kredi kartı gerekmez. Kurulum desteği dahil.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#0A0A0B] shadow-xl transition-all hover:bg-white/90"
                >
                  Ücretsiz Denemeye Başlayın
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
              <p className="mt-4 text-sm text-white/20">14 günlük deneme &bull; İptal etmesi kolay &bull; 7/24 destek</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function FooterSection() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold tracking-tight">Saha Flow</span>
          </div>
          <div className="flex gap-6 text-sm text-white/30">
            <Link href="/login" className="transition-colors hover:text-white/60">Giriş Yap</Link>
            <a href="#features" className="transition-colors hover:text-white/60">Özellikler</a>
            <a href="#pricing" className="transition-colors hover:text-white/60">Fiyatlandırma</a>
            <a href="#faq" className="transition-colors hover:text-white/60">SSS</a>
          </div>
          <p className="text-sm text-white/20">&copy; 2026 Saha Flow</p>
        </div>
      </div>
    </footer>
  );
}
