import { Link } from 'react-router-dom';
import { PageIntro } from '@/components/common/PageIntro';
import { DemoNotice } from '@/components/common/DemoNotice';
import { usePageMeta } from '@/hooks/usePageMeta';

type PolicyType = 'shipping' | 'returns' | 'privacy' | 'terms';

interface PolicyData {
  title: string;
  eyebrow: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}

const policies: Record<PolicyType, PolicyData> = {
  shipping: {
    eyebrow: 'Logistics & Transit',
    title: 'Shipping and Delivery Policy',
    intro: 'Clear terms on order fulfillment, delivery timeframes across India, and complimentary thresholds.',
    sections: [
      {
        heading: '1. Fulfillment Timelines',
        body: [
          'All orders are picked, packaged, and dispatched from our Mumbai atelier within 24 to 48 business hours of order confirmation (excluding Sundays and national holidays).',
          'During high-volume drop releases, processing may take up to 72 hours. You will receive an automated dispatch notification with carrier tracking as soon as your parcel is handed over.',
        ],
      },
      {
        heading: '2. Domestic Shipping Rates',
        body: [
          'Orders equal to or exceeding ₹1,999 qualify for complimentary Standard Shipping anywhere within India.',
          'Orders below ₹1,999 carry a flat standard shipping fee of ₹149.',
          'Express Air Courier (1–2 business days to major metros) is available at checkout for an additional ₹299.',
        ],
      },
      {
        heading: '3. Carrier Partners and Tracking',
        body: [
          'We partner exclusively with tier-one insured logistics couriers (Blue Dart, Delhivery, and DTDC).',
          'A live tracking link is transmitted via email and updated in your customer portal as soon as pickup is recorded.',
        ],
      },
      {
        heading: '4. Non-Delivery & Address Accuracy',
        body: [
          'Please ensure all shipping fields including pin code and contact number are accurate. Our carriers require a recipient contact number for OTP or delivery coordination.',
        ],
      },
    ],
  },
  returns: {
    eyebrow: 'Exchanges & Refunds',
    title: 'Returns & Exchanges Policy',
    intro: 'We stand behind the construction and fit of every garment. Here is our straightforward 14-day return framework.',
    sections: [
      {
        heading: '1. The 14-Day Window',
        body: [
          'We accept returns and size exchange requests within 14 calendar days from the date of confirmed delivery.',
          'To be eligible, garments must be unworn, unwashed, unaltered, and with all original tags and security ties intact.',
        ],
      },
      {
        heading: '2. Complimentary Doorstep Reverse Pickup',
        body: [
          'For all size exchanges and eligible returns within India, our courier team provides complimentary doorstep pickup.',
          'Initiate your request directly from your Account Dashboard under Orders, or dispatch an email to returns@streetwear.studio.',
        ],
      },
      {
        heading: '3. Quality Inspection & Processing',
        body: [
          'Upon receipt at our Mumbai studio, returns undergo quality inspection within 48 business hours.',
          'Approved refunds are remitted to the original payment source. Depending on your financial institution, funds appear within 5 to 7 business days.',
        ],
      },
      {
        heading: '4. Archive & Final Sale Items',
        body: [
          'Pieces explicitly designated as "Archive Drop" or "Final Sale" are eligible for size exchange only (subject to inventory availability) or store credit.',
        ],
      },
    ],
  },
  privacy: {
    eyebrow: 'Data Stewardship',
    title: 'Privacy Policy',
    intro: 'How STREETWEAR. collects, protects, and respects your customer data and personal information.',
    sections: [
      {
        heading: '1. Information We Collect',
        body: [
          'We collect information you explicitly provide: your name, shipping address, email address, telephone number, and order preferences.',
          'We do not store or process complete credit card or banking secrets on our servers. In current demo mode, all authentication and order records reside in client-side storage.',
        ],
      },
      {
        heading: '2. Purpose of Processing',
        body: [
          'Your data is utilized strictly to fulfill your orders, communicate delivery updates, provide concierge sizing counsel, and send our monthly studio newsletter if subscribed.',
          'We never sell, lease, or monetize your contact information with third-party advertising syndicates.',
        ],
      },
      {
        heading: '3. Data Security & Storage',
        body: [
          'Our architecture uses industry-standard TLS encryption during transit. In the planned Firebase deployment, documents are protected by strict Firestore Security Rules and authenticated user claims.',
        ],
      },
      {
        heading: '4. Your Rights',
        body: [
          'You retain full rights to inspect, update, or request the deletion of your account profile and order records by contacting privacy@streetwear.studio.',
        ],
      },
    ],
  },
  terms: {
    eyebrow: 'Terms of Service',
    title: 'Terms and Conditions',
    intro: 'The governing guidelines for purchasing, using our storefront, and engaging with the STREETWEAR. brand.',
    sections: [
      {
        heading: '1. Scope & Demo Status',
        body: [
          'This web storefront represents a demonstration portfolio build. Products, prices in Indian Rupees (INR), and inventory numbers reflect realistic simulation data.',
          'Orders submitted through the demo checkout generate local mock fulfillment references and do not charge real payment instruments.',
        ],
      },
      {
        heading: '2. Intellectual Property',
        body: [
          'All typography, branding, editorial campaign imagery, UI layouts, and garment designs featured herein are the intellectual property of the studio and may not be reproduced without consent.',
        ],
      },
      {
        heading: '3. Pricing & Currency',
        body: [
          'All displayed pricing is denominated in Indian Rupees (₹ INR) and inclusive of statutory domestic taxes unless explicitly noted.',
          'The studio reserves the right to amend pricing, drop dates, and inventory availability prior to order confirmation.',
        ],
      },
      {
        heading: '4. Limitation of Liability',
        body: [
          'To the fullest extent permitted by law, STREETWEAR. and its associates shall not be liable for incidental, special, or consequential damages resulting from store access or garment usage.',
        ],
      },
    ],
  },
};

export function PolicyPage({ policy }: { policy: PolicyType }) {
  const data = policies[policy] ?? policies.terms;

  usePageMeta({
    title: data.title,
    description: data.intro,
  });

  return (
    <div>
      <PageIntro eyebrow={data.eyebrow} title={data.title} description={data.intro} />

      <div className="container-editorial py-12 md:py-20">
        <div className="mx-auto max-w-3xl space-y-12">
          <DemoNotice>
            These policies are provided as realistic editorial placeholders for the demo storefront.
            They should be reviewed and customized with your legal and logistics partners before commercial production launch.
          </DemoNotice>

          {data.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="display text-xl sm:text-2xl text-ink pb-2 border-b border-ink/10">
                {section.heading}
              </h2>
              {section.body.map((p, idx) => (
                <p key={idx} className="text-sm leading-relaxed text-ink-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <div className="pt-8 border-t border-ink/15 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-muted">
            <span>Last revised: October 2026</span>
            <div className="flex gap-4">
              <Link to="/shipping" className="hover:text-ink">Shipping</Link>
              <Link to="/returns" className="hover:text-ink">Returns</Link>
              <Link to="/privacy" className="hover:text-ink">Privacy</Link>
              <Link to="/terms" className="hover:text-ink">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
