import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import PageShell from './PageShell'

const faq = [
  { question: 'How can I get property guidance?', answer: 'Use the enquiry form, call 099201 33345, or send a message through WhatsApp. The consultancy can discuss your goals, budget, and preferred areas.' },
  { question: 'Do you help with financing?', answer: 'Yes. Finance support is available for buyers who want to understand affordability, documentation, and home-loan options before making a decision.' },
  { question: 'Can I view a property before booking?', answer: 'Availability and viewing arrangements are confirmed directly with the consultancy. Share your preferred property or area using the contact form.' },
  { question: 'How are testimonials reviewed?', answer: 'Submitted reviews are checked before publication. The team may remove content that does not follow the stated review guidelines.' },
  { question: 'Can I request a consultation?', answer: 'Yes. Select a consultation request through the contact page, call the office number, or message the team on WhatsApp.' },
]

export default function FaqPage() {
  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <PageShell title="Frequently Asked Questions | Vikas U Desai" description="Find answers about property guidance, finance support, consultations, testimonials, and contacting Vikas U Desai." schema={faqSchema}>
      <main className="page-shell container">
        <SectionHeading eyebrow="FAQ" title="Answers for property and finance enquiries." subtitle="Common questions about working with the consultancy, arranging a viewing, and understanding the services offered." />
        <div className="faq-list">
          {faq.map((item) => (
            <details className="card faq-item" key={item.question}>
              <summary><h3>{item.question}</h3></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
        <CTASection title="Still have a question?" text="Contact the consultancy for a focused, practical response to your property or finance requirement." primaryLabel="Contact us" primaryTo="/contact" />
      </main>
    </PageShell>
  )
}
