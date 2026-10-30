import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { PageIntro } from '@/components/common/PageIntro';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { usePageMeta } from '@/hooks/usePageMeta';

const faqCategories = [
  {
    category: 'Sizing & Garment Fit',
    items: [
      {
        question: 'How do STREETWEAR. garments fit compared to standard sizing?',
        answer:
          'Our silhouettes feature intentional contemporary cuts: dropped shoulders, generous chest measurements, and cropped or classic boxy hemlines. If you prefer a traditional fitted silhouette, consider sizing down one size. Detailed chest and length charts are provided on every product page.',
      },
      {
        question: 'Will heavyweight cotton tees shrink after washing?',
        answer:
          'All our 280 GSM cotton jersey and loopback fleece pieces undergo pre-shrinking and enzyme washing at our mill. When washed cold (30°C) and hung to dry, shrinkage is kept under 2%.',
      },
      {
        question: 'Can I request personal sizing counsel?',
        answer:
          'Yes. Send your height, weight, chest measurement, and typical fit preference to hello@streetwear.studio or through our contact page, and our atelier team will recommend your optimal size.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        question: 'How much does shipping cost across India?',
        answer:
          'All orders above ₹1,999 qualify for complimentary standard shipping across India. For orders below ₹1,999, standard insured shipping is ₹149. Express courier is available at checkout for ₹299.',
      },
      {
        question: 'What are estimated delivery timeframes?',
        answer:
          'Standard dispatch takes 24 to 48 business hours. Metro deliveries (Mumbai, Delhi NCR, Bengaluru) typically arrive in 2–3 business days. All other Indian regions arrive in 4–6 business days. Express shipping delivers in 1–2 business days.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'Currently our primary storefront handles domestic deliveries across India. International dispatches are available by bespoke arrangement through our client concierge team.',
      },
    ],
  },
  {
    category: 'Returns, Exchanges & Cancellations',
    items: [
      {
        question: 'What is your return policy?',
        answer:
          'We offer a 14-day return and exchange window from the date of confirmed delivery. Items must be in original unworn condition with all garment tags, security ties, and packaging intact.',
      },
      {
        question: 'How do I initiate a return or size exchange?',
        answer:
          'Log in to your account, visit your Orders tab, and select "Request Return / Exchange" on the relevant order, or dispatch a message with your order number to returns@streetwear.studio. We arrange complimentary doorstep return pickup.',
      },
      {
        question: 'When will I receive my refund?',
        answer:
          'Once the returned garment passes quality inspection at our Mumbai studio (typically within 48 hours of receipt), refunds are processed to your original payment method in 5–7 bank days.',
      },
    ],
  },
  {
    category: 'Care & Maintenance',
    items: [
      {
        question: 'How should I care for raw denim and structured outerwear?',
        answer:
          'For denim: wear frequently and wash sparingly. Spot clean where possible. When washing, turn inside out, wash in cold water with gentle detergent, and air dry flat away from direct sunlight. Never tumble dry.',
      },
      {
        question: 'How do I care for heavy knitwear and mohair blends?',
        answer:
          'Store folded on flat surfaces—never hang heavy knitwear as it will stretch the weave. Dry clean or gentle hand wash cold with wool-friendly detergent.',
      },
    ],
  },
];

export function FaqPage() {
  usePageMeta({
    title: 'Frequently Asked Questions',
    description: 'Everything you need to know about sizing, drops, domestic delivery, and studio policies.',
  });

  return (
    <div>
      <PageIntro
        eyebrow="Knowledge Base"
        title="Frequently asked questions."
        description="Comprehensive details on fits, shipping timelines, returns, and garment preservation."
      />

      <div className="container-editorial py-12 md:py-20">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Left quick navigation */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-ink/15 bg-paper p-6">
              <span className="label-xs text-ink-muted">Categories</span>
              <ul className="mt-4 space-y-2 text-sm">
                {faqCategories.map((cat, idx) => (
                  <li key={cat.category}>
                    <a
                      href={`#category-${idx}`}
                      className="text-ink-muted transition-colors hover:text-ink hover:underline underline-offset-4"
                    >
                      {cat.category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-ink/10 bg-bone p-6">
              <HelpCircle className="size-5 text-ink" />
              <h3 className="mt-3 font-semibold text-sm">Have an unanswered question?</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                Our client services concierge is ready to assist with custom requests and sizing queries.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/contact">
                  Speak with Concierge
                  <ArrowRight className="size-3" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right accordion list */}
          <div className="lg:col-span-8 space-y-12">
            {faqCategories.map((cat, idx) => (
              <section key={cat.category} id={`category-${idx}`} className="scroll-mt-24">
                <h2 className="display text-2xl mb-6 pb-2 border-b border-ink/15">
                  {cat.category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {cat.items.map((item, itemIdx) => (
                    <AccordionItem key={item.question} value={`item-${idx}-${itemIdx}`}>
                      <AccordionTrigger className="text-left font-medium text-base text-ink hover:text-ink-muted hover:no-underline py-5">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-ink-muted pb-6">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
