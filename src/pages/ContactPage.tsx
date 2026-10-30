import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Clock, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { PageIntro } from '@/components/common/PageIntro';
import { Button } from '@/components/ui/button';
import { TextField, TextAreaField } from '@/components/forms/Fields';
import { usePageMeta } from '@/hooks/usePageMeta';
import { contactSchema, type ContactFormValues } from '@/schemas';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  usePageMeta({
    title: 'Client Services & Contact',
    description: 'Get in touch with the STREETWEAR. atelier and customer concierge.',
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log('Client inquiry submitted:', data);
    setSubmitted(true);
    reset();
  };

  return (
    <div>
      <PageIntro
        eyebrow="Client Concierge"
        title="We’re here for inquiries, sizing counsel, and orders."
        description="Our Mumbai studio team responds to all notes within 24 business hours."
      />

      <div className="container-editorial py-12 md:py-20">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <span className="label-xs text-ink-muted">Studio Address</span>
              <div className="mt-3 flex items-start gap-3">
                <MapPin className="size-5 shrink-0 text-ink mt-0.5" />
                <p className="text-sm leading-relaxed text-ink">
                  STREETWEAR. Atelier<br />
                  14 Field Notes Lane, Lower Parel<br />
                  Mumbai, Maharashtra 400013<br />
                  India
                </p>
              </div>
            </div>

            <div>
              <span className="label-xs text-ink-muted">Direct Communication</span>
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-3 text-sm text-ink">
                  <Mail className="size-4 shrink-0 text-ink-muted" />
                  <a href="mailto:hello@streetwear.studio" className="hover:underline underline-offset-4">
                    hello@streetwear.studio
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-ink">
                  <Phone className="size-4 shrink-0 text-ink-muted" />
                  <a href="tel:+919876543210" className="hover:underline underline-offset-4">
                    +91 (022) 4920 8800
                  </a>
                </div>
              </div>
            </div>

            <div>
              <span className="label-xs text-ink-muted">Concierge Hours</span>
              <div className="mt-3 flex items-start gap-3 text-sm text-ink">
                <Clock className="size-4 shrink-0 text-ink-muted mt-0.5" />
                <div>
                  <p>Monday — Friday: 10:00 – 19:00 IST</p>
                  <p className="text-xs text-ink-muted mt-1">Saturday: 11:00 – 16:00 IST (Sizing & Order Inquiries)</p>
                </div>
              </div>
            </div>

            <div className="border border-ink/10 bg-bone p-6">
              <span className="label-xs text-ink-muted">Looking for quick answers?</span>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                Questions about domestic shipping timelines, fabric weights, or exchange policies are answered in our FAQ.
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <a href="/faq">Visit the FAQ Hub</a>
                </Button>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="border border-ink/15 bg-paper p-8 sm:p-10">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="size-5 text-ink" />
                <h2 className="text-xl font-semibold tracking-tight">Send a Dispatch</h2>
              </div>

              {submitted ? (
                <div className="py-12 text-center" role="alert">
                  <CheckCircle2 className="mx-auto size-12 text-ink" />
                  <h3 className="display mt-4 text-2xl">Message Received</h3>
                  <p className="mt-2 text-sm text-ink-muted max-w-sm mx-auto">
                    Thank you for reaching out. A studio representative will reply to your registered email shortly.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Dispatch
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <TextField
                      label="Your Name *"
                      placeholder="e.g. Kabir Sen"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <TextField
                      label="Email Address *"
                      type="email"
                      placeholder="e.g. kabir@domain.com"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>

                  <TextField
                    label="Inquiry Subject *"
                    placeholder="e.g. Sizing counsel for Drop 001 Boxy Tee"
                    error={errors.subject?.message}
                    {...register('subject')}
                  />

                  <TextAreaField
                    label="Message *"
                    rows={5}
                    placeholder="How can our studio team assist you?"
                    error={errors.message?.message}
                    {...register('message')}
                  />

                  <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? 'Transmitting…' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
