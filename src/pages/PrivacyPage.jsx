import SectionHeading from '../components/SectionHeading'
import PageShell from './PageShell'

export default function PrivacyPage() {
  return (
    <PageShell title="Privacy Policy | Vikas U Desai" description="Privacy policy explaining how enquiry, review, and appointment information is handled by the consultancy website.">
      <main className="page-shell container">
        <SectionHeading eyebrow="Privacy" title="Privacy policy" subtitle="Clear information about the contact and enquiry data collected by this website." />
        <div className="privacy-content card">
          <h3>Information we collect</h3>
          <p>We may collect contact details, property requirements, appointment preferences, messages, and reviews submitted through public forms. This information is used to respond to enquiries and manage the website's services.</p>
          <h3>How information is used</h3>
          <p>Contact details are used to answer property and finance enquiries, arrange appointments, and follow up with prospective clients. Review submissions are reviewed before publication.</p>
          <h3>Data handling and security</h3>
          <p>We use practical server-side validation, request-size limits, security headers, secure cookies in production, and rate limiting on public submission endpoints. No system is completely risk-free, so users should avoid sharing sensitive information beyond what is necessary.</p>
          <h3>Legal contact</h3>
          <p>For privacy questions, contact the consultancy directly by phone or through the contact page. This policy may be updated as services or legal obligations change.</p>
        </div>
      </main>
    </PageShell>
  )
}
