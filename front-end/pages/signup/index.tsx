import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import SignForm from '@/components/users/signForm';

const Authentication: React.FC = () => {
  return (
    <>
      <Header />
      <main className="vh-100">
        <section className="row justify-content-evenly">
          <SignForm method="signup" header="Sign up" />
        </section>
        <Link href="/" className="btn btn-outline-primary">
          Back
        </Link>
      </main>
      <Footer />
    </>
  );
};

export default Authentication;