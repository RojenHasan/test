import Head from 'next/head';
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { useRouter } from 'next/router';



const Header: React.FC = () => {
  const router = useRouter();
  return (
    <header className={`p-3 mb-3 border-b ${router.pathname === '/'}`}>
      <Link href="/" className="fs-2 mb-2 mb-lg-0 text-black">
        {" "}
        General Practice Clinic
      </Link>

      <nav className="nav justify-content-center">
        <Link
          href="/"
          className={`nav-link px-4 fs-5 ${router.pathname === '/' ? 'text-b48d8d fs-6' : 'text-sm text-black'
            } hover:bg-white`}
        > Home
        </Link>
        <Link href="/doctors" className={`nav-link px-4 fs-5 ${router.pathname === '/doctors' ? 'text-white' : 'text-black'} hover:bg-CE6E78`}>
          Doctors
        </Link>
        <Link href="/doctors/add" className={`nav-link px-4 fs-5 ${router.pathname === '/doctors/add' ? 'text-white' : 'text-black'} hover:bg-CE6E78`}>
          Add doctor
        </Link>
        <Link href="/patients" className={`nav-link px-4 fs-5 ${router.pathname === '/patients' ? 'text-white' : 'text-black'} hover:bg-CE6E78`}>
          Patients
        </Link>
        <Link href="/appointments" className={`nav-link px-4 fs-5 ${router.pathname === '/appointments' ? 'text-white' : 'text-black'} hover:bg-CE6E78`}>
          Appointments overview
        </Link>
        <Link href="/appointments/add" className={`nav-link px-4 fs-5 ${router.pathname === '/appointments/add' ? 'text-white' : 'text-black'} hover:bg-CE6E78`}>
          Make an appointment
        </Link>
      </nav>
    </header>
  );
};

export default Header;
